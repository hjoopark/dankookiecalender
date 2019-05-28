import AWS from 'aws-sdk'

AWS.config.update({
  region: 'ap-northeast-2',
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-2:ed115d46-19de-4703-891a-7a7ef9b9bf28'
  })
})
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: 'dankookie'
  }
})

function getCurrentTime () {
  function pad2 (n) {
    return n < 10 ? '0' + n : n
  }
  var now = new Date()
  return (
    now.getFullYear().toString() +
    pad2(now.getMonth() + 1) +
    pad2(now.getDate()) +
    pad2(now.getHours()) +
    pad2(now.getMinutes()) +
    pad2(now.getSeconds()) +
    pad2(now.getMilliseconds())
  )
}

function uploadS3 (key, file) {
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Key: key,
        Body: file,
        ACL: 'public-read'
      },
      {
        partSize: 5242880, queueSize: 1
      },
      (err, data) => {
        if (err) reject(err)
        resolve(data)
      }
    )
  })
}

export default {
  install (Vue, options) {
    Vue.prototype.$uploadImage = type => {
      return new Promise((resolve, reject) => {
        let fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.setAttribute(
          'accept',
          'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
        )

        var onSelectImage = () => {
          if (!fileInput.files) return
          const file = fileInput.files[0]
          if (!file) return

          const fileExt = file.name.substr(file.name.lastIndexOf('.') + 1)
          const key = `uploads/${type}/${getCurrentTime()}.${fileExt}`

          uploadS3(key, file)
            .then(data => {
              if (type === 'profile') {
                resolve({
                  ...data,
                  resized: data.Location.replace(
                    'uploads/profile/',
                    'resized/profile/s/'
                  )
                })
              } else {
                resolve(data)
              }
            })
            .catch(reject)
        }

        fileInput.addEventListener('change', onSelectImage)
        fileInput.click()
        /* debug iphone (can't trigger change event) */
        setTimeout(onSelectImage, 5000)
      })
    }

    Vue.prototype.$uploadImages = type => {
      return new Promise((resolve, reject) => {
        let fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.setAttribute('multiple', 'multiple')
        fileInput.setAttribute(
          'accept',
          'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
        )
        fileInput.addEventListener('change', () => {
          if (!fileInput.files) return
          const files = Array.from(fileInput.files)

          Promise.all(
            files.map(file => {
              let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1)
              let key = `uploads/${type}/${getCurrentTime()}.${fileExt}`
              return uploadS3(key, file)
            })
          )
            .then(resolve)
            .catch(reject)
        })
        fileInput.click()
      })
    }

    Vue.prototype.$uploadFile = (type, file) => {
      return new Promise((resolve, reject) => {
        if (!file || !file.name) return
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1)
        let key = `uploads/${type}/${getCurrentTime()}.${fileExt}`
        uploadS3(key, file)
          .then(resolve)
          .catch(reject)
      })
    }
  }
}
