export default {
  anonymous: {
    enum: [
      {
        label: '익명으로 작성',
        value: true
      },
      {
        label: '닉네임으로 작성',
        value: false
      }
    ],
    validate: "'required'"
  },

  star_rate: {
    enum: [
      {
        label: '1',
        value: 1
      },
      {
        label: '2',
        value: 2
      },
      {
        label: '3',
        value: 3
      },
      {
        label: '4',
        value: 4
      },
      {
        label: '5',
        value: 5
      }
    ],
    validate: 'required'
  },

  received_grade: {
    enum: [
      {
        label: 'A+',
        value: 'A+'
      },
      {
        label: 'A',
        value: 'A'
      },
      {
        label: 'B+',
        value: 'B+'
      },
      {
        label: 'B',
        value: 'B'
      },
      {
        label: 'C+',
        value: 'C+'
      },
      {
        label: 'C',
        value: 'C'
      },
      {
        label: 'D+',
        value: 'D+'
      },
      {
        label: 'D',
        value: 'D'
      },
      {
        label: 'F',
        value: 'F'
      },
      {
        label: '비공개',
        value: '비공개'
      }
    ],
    validate: 'required'
  },

  lecture_difficulty: {
    enum: [
      {
        label: '쉬움',
        value: 0
      },
      {
        label: '보통',
        value: 1
      },
      {
        label: '어려움',
        value: 2
      }
    ],
    validate: 'required'
  },

  assignment: {
    enum: [
      {
        label: '없음',
        value: 0
      },
      {
        label: '보통',
        value: 1
      },
      {
        label: '많음',
        value: 2
      }
    ],
    validate: 'required'
  },

  group_task: {
    enum: [
      {
        label: '없음',
        value: 0
      },
      {
        label: '보통',
        value: 1
      },
      {
        label: '많음',
        value: 2
      }
    ],
    validate: 'required'
  },

  grade_difficulty: {
    enum: [
      {
        label: '쉬움',
        value: 0
      },
      {
        label: '보통',
        value: 1
      },
      {
        label: '어려움',
        value: 2
      }
    ],
    validate: 'required'
  },

  semesterYear: {
    enum: [
      {
        label: `${new Date().getFullYear()}년`,
        value: new Date().getFullYear().toString()
      },
      {
        label: `${new Date().getFullYear() - 1}년`,
        value: (new Date().getFullYear() - 1).toString()
      },
      {
        label: `${new Date().getFullYear() - 2}년`,
        value: (new Date().getFullYear() - 2).toString()
      }
    ],
    validate: 'required'
  },

  semesterHakgi: {
    enum: [
      {
        label: '1학기',
        value: '1'
      },
      {
        label: '2학기',
        value: '2'
      },
      {
        label: '동계 계절학기',
        value: '동계'
      },
      {
        label: '하계 계절학기',
        value: '하계'
      }
    ],
    validate: 'required'
  },

  getEnum (name) {
    return this[name].enum
  },

  getLabels (name) {
    return this[name].enum.map(e => e.label).toString()
  },

  getValues (name) {
    return this[name].enum.map(e => e.value).toString()
  },

  getValidate (name) {
    return this[name].validate
  }
}
