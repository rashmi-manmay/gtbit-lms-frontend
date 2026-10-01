// GTBIT IT Department Timetable - Aug-Dec 2026
// Timetable data used for automatic leave-adjustment checking.
// Blank cells, "---", "-X-" and "-" are treated as FREE/no scheduled class.

export const timetableData = [
  {
    teacher: "Dr. Amandeep Kaur",
    schedule: {
      Monday: {
        "10:00-11:00": "2nd Year_IT(2nd Shift)_B",
        "01:30-02:30": "2nd Year_IT(2nd Shift)"
      },
      Tuesday: {
        "10:00-11:00": "3rd Year_IT2_A",
        "01:30-02:30": "3rd Year_IT2"
      },
      Wednesday: {
        "12:30-01:30": "3rd Year_IT2"
      },
      Thursday: {
        "11:00-12:00": "3rd Year_IT2",
        "12:30-01:30": "3rd Year_IT2_B"
      },
      Friday: {
        "10:00-11:00": "2nd Year_IT(2nd Shift)_A",
        "01:30-02:30": "2nd Year_IT(2nd Shift)"
      }
    }
  },

  {
    teacher: "Dr. P.S. Bedi",
    schedule: {
      Monday: {
        "10:00-11:00": "2nd Year_IT3",
        "12:30-01:30": "2nd Year_IT3_B"
      },
      Tuesday: {
        "11:00-12:00": "2nd Year_IT1",
        "12:30-01:30": "2nd Year_IT3",
        "01:30-02:30": "2nd Year_IT1_A"
      },
      Wednesday: {
        "10:00-11:00": "2nd Year_IT3",
        "12:30-01:30": "2nd Year_IT3_A",
        "01:30-02:30": "2nd Year_IT1"
      },
      Thursday: {},
      Friday: {
        "12:30-01:30": "2nd Year_IT1_B",
        "01:30-02:30": "2nd Year_IT1"
      }
    }
  },

  {
    teacher: "Dr. Gurpreet Kaur",
    schedule: {
      Monday: {
        "10:00-11:00": "3rd Year_IT3",
        "01:30-02:30": "2nd Year_IT(2nd Shift)"
      },
      Tuesday: {
        "10:00-11:00": "3rd Year_IT3_A",
        "01:30-02:30": "3rd Year_IT3"
      },
      Wednesday: {
        "01:30-02:30": "2nd Year_IT(2nd Shift)",
        "02:30-03:30": "2nd Year_IT(2nd Shift)_A"
      },
      Thursday: {
        "10:00-11:00": "3rd Year_IT3_B",
        "12:30-01:30": "3rd Year_IT3",
        "02:30-03:30": "2nd Year_IT(2nd Shift)"
      },
      Friday: {
        "10:00-11:00": "2nd Year_IT(2nd Shift)_B",
        "12:30-01:30": "2nd Year_IT(2nd Shift)"
      }
    }
  },

  {
    teacher: "Dr. Savneet Kaur",
    schedule: {
      Monday: {
        "12:30-01:30": "2nd Year_IT2"
      },
      Tuesday: {
        "10:00-11:00": "2nd Year_IT2_B",
        "12:30-01:30": "3rd Year_IT(2nd Shift)"
      },
      Wednesday: {
        "10:00-11:00": "2nd Year_IT2_A",
        "12:30-01:30": "3rd Year_IT(2nd Shift)"
      },
      Thursday: {
        "11:00-12:00": "2nd Year_IT2",
        "12:30-01:30": "3rd Year_IT(2nd Shift)"
      },
      Friday: {
        "10:00-11:00": "3rd Year_IT(2nd Shift)",
        "12:30-01:30": "2nd Year_IT2",
        "01:30-02:30": "3rd Year_IT(2nd Shift)_B"
      }
    }
  },

  {
    teacher: "Dr. Rashmi Arora",
    schedule: {
      Monday: {
        "08:00-09:00": "3rd Year_IT3",
        "10:00-11:00": "3rd Year_IT(2nd Shift)",
        "12:30-01:30": "3rd Year_IT(2nd Shift)_B"
      },
      Tuesday: {
        "08:00-09:00": "3rd Year_IT3_A",
        "09:00-10:00": "3rd Year_IT3_B"
      },
      Wednesday: {
        "10:00-11:00": "4th Year_IT(FSD)",
        "02:30-03:30": "3rd Year_IT3"
      },
      Thursday: {
        "09:00-10:00": "4th Year_IT(FSD)",
        "11:00-12:00": "3rd Year_IT(2nd Shift)",
        "02:30-03:30": "3rd Year_IT3"
      },
      Friday: {
        "10:00-11:00": "3rd Year_IT3",
        "12:30-01:30": "3rd Year_IT(2nd Shift)",
        "01:30-02:30": "3rd Year_IT(2nd Shift)_A"
      }
    }
  },

  {
    teacher: "Mr. Aman Kumar",
    schedule: {
      Monday: {
        "10:00-11:00": "4th Year_IT(FSD)",
        "11:00-12:00": "4th Year_IT(MLDA)",
        "12:30-01:30": "3rd Year_IT2",
        "01:30-02:30": "4th Year_IT(FSD)_A"
      },
      Tuesday: {
        "09:00-10:00": "4th Year_IT(MLDA)",
        "11:00-12:00": "2nd Year_IT(2nd Shift)",
        "12:30-01:30": "4th Year_IT(FSD)"
      },
      Wednesday: {
        "09:00-10:00": "4th Year_IT(MLDA)",
        "11:00-12:00": "3rd Year_IT2",
        "12:30-01:30": "2nd Year_IT(2nd Shift)",
        "02:30-03:30": "4th Year_IT(FSD)"
      },
      Thursday: {
        "10:00-11:00": "3rd Year_IT2",
        "12:30-01:30": "3rd Year_IT2_A",
        "01:30-02:30": "2nd Year_IT(2nd Shift)"
      },
      Friday: {
        "10:00-11:00": "4th Year_IT(FSD)_B",
        "12:30-01:30": "3rd Year_IT2",
        "02:30-03:30": "2nd Year_IT(2nd Shift)"
      }
    }
  },

  {
    teacher: "Mr. Amandeep Singh",
    schedule: {
      Monday: {
        "12:30-01:30": "1st_Year_IT(2nd Shift)_B",
        "01:30-02:30": "3rd Year_IT(2nd Shift)",
        "02:30-03:30": "1st_Year_IT(2nd Shift)"
      },
      Tuesday: {
        "12:30-01:30": "1st_Year_IT(2nd Shift)",
        "01:30-02:30": "4th Year_IT(MLDA)",
        "03:30-04:30": "3rd Year_IT(2nd Shift)"
      },
      Wednesday: {
        "11:00-12:00": "4th Year_IT(MLDA)",
        "12:30-01:30": "3rd Year_IT(2nd Shift)",
        "02:30-03:30": "3rd Year_IT(2nd Shift)_B"
      },
      Thursday: {
        "10:00-11:00": "4th Year_IT(MLDA)",
        "02:30-03:30": "3rd Year_IT(2nd Shift)_A"
      },
      Friday: {
        "11:00-12:00": "3rd Year_IT(2nd Shift)",
        "12:30-01:30": "1st_Year_IT(2nd Shift)",
        "02:30-03:30": "1st_Year_IT(2nd Shift)_A"
      }
    }
  },

  {
    teacher: "Mr. Gaurav Sandhu",
    schedule: {
      Monday: {
        "09:00-10:00": "3rd Year_IT2",
        "10:00-11:00": "3rd Year_IT2_A",
        "02:30-03:30": "3rd Year_IT(2nd Shift)"
      },
      Tuesday: {
        "10:00-11:00": "3rd Year_IT2_B"
      },
      Wednesday: {
        "10:00-11:00": "3rd Year_IT2",
        "02:30-03:30": "3rd Year_IT(2nd Shift)_A"
      },
      Thursday: {
        "01:30-02:30": "3rd Year_IT(2nd Shift)",
        "02:30-03:30": "3rd Year_IT(2nd Shift)_B"
      },
      Friday: {
        "09:00-10:00": "3rd Year_IT2",
        "10:00-11:00": "3rd Year_IT2_B",
        "02:30-03:30": "3rd Year_IT(2nd Shift)"
      }
    }
  },

  {
    teacher: "Mr. Kanwarjit Singh",
    schedule: {
      Monday: {
        "09:00-10:00": "2nd Year_CSE(DS)",
        "02:30-03:30": "2nd Year_IT3"
      },
      Tuesday: {
        "09:00-10:00": "2nd Year_IT2",
        "11:00-12:00": "2nd Year_IT3",
        "12:30-01:30": "2nd Year_CSE(DS)"
      },
      Wednesday: {
        "09:00-10:00": "2nd Year_CSE(DS)",
        "10:00-11:00": "3rd Year_IT3_A"
      },
      Thursday: {
        "08:00-09:00": "3rd Year_IT3_B",
        "10:00-11:00": "2nd Year_IT3",
        "12:30-01:30": "2nd Year_IT2"
      },
      Friday: {
        "09:00-10:00": "2nd Year_IT2",
        "11:00-12:00": "2nd Year_CSE(DS)",
        "01:30-02:30": "2nd Year_IT3"
      }
    }
  },

  {
    teacher: "Mr. Navjot Singh",
    schedule: {
      Monday: {
        "09:00-10:00": "3rd Year_IT1",
        "11:00-12:00": "3rd Year_IT(2nd Shift)",
        "12:30-01:30": "3rd Year_IT(2nd Shift)_A",
        "01:30-02:30": "2nd Year_IT1"
      },
      Tuesday: {
        "08:00-09:00": "3rd Year_IT1",
        "09:00-10:00": "2nd Year_IT1",
        "11:00-12:00": "3rd Year_IT(2nd Shift)",
        "12:30-01:30": "3rd Year_IT(2nd Shift)_B"
      },
      Wednesday: {
        "09:00-10:00": "2nd Year_IT1",
        "10:00-11:00": "3rd Year_IT1",
        "11:00-12:00": "3rd Year_IT(2nd Shift)",
        "12:30-01:30": "3rd Year_IT1_A"
      },
      Thursday: {
        "08:00-09:00": "3rd Year_IT1_B",
        "09:00-10:00": "3rd Year_IT(2nd Shift)",
        "12:30-01:30": "3rd Year_IT1"
      },
      Friday: {}
    }
  },

  {
    teacher: "Mr. Pradeep Gulati",
    schedule: {
      Monday: {
        "10:00-11:00": "3rd Year_IT2_B",
        "01:30-02:30": "3rd Year_IT2"
      },
      Tuesday: {
        "01:30-02:30": "3rd Year_IT2"
      },
      Wednesday: {
        "10:00-11:00": "1st_Year_IT2_A",
        "12:30-01:30": "3rd Year_IT2"
      },
      Thursday: {
        "09:00-10:00": "1st_Year_IT2",
        "10:00-11:00": "1st_Year_IT2_B",
        "12:30-01:30": "3rd Year_IT2"
      },
      Friday: {
        "10:00-11:00": "3rd Year_IT2_A"
      }
    }
  },

  {
    teacher: "Ms. Bhavneet Kaur",
    schedule: {
      Monday: {
        "10:00-11:00": "1st_Year_IT3_B",
        "01:30-02:30": "1st_Year_IT3_A"
      },
      Tuesday: {
        "09:00-10:00": "1st_Year_IT3",
        "10:00-11:00": "4th Year_IT(MLDA)",
        "01:30-02:30": "3rd Year_IT3"
      },
      Wednesday: {
        "10:00-11:00": "3rd Year_IT3_B",
        "01:30-02:30": "4th Year_IT(MLDA)"
      },
      Thursday: {
        "10:00-11:00": "3rd Year_IT3_A",
        "12:30-01:30": "1st_Year_IT3",
        "01:30-02:30": "4th Year_IT(MLDA)"
      },
      Friday: {
        "11:00-12:00": "3rd Year_IT3",
        "01:30-02:30": "1st_Year_IT3"
      }
    }
  },

  {
    teacher: "Ms. Debleena",
    schedule: {
      Monday: {
        "09:00-10:00": "3rd Year_IT3",
        "10:00-11:00": "4th Year_IT3_B"
      },
      Tuesday: {
        "08:00-09:00": "3rd Year_IT3_B",
        "09:00-10:00": "2nd Year_IT1"
      },
      Wednesday: {
        "09:00-10:00": "3rd Year_IT3",
        "10:00-11:00": "2nd Year_IT1_A"
      },
      Thursday: {
        "08:00-09:00": "3rd Year_IT3_A",
        "09:00-10:00": "2nd Year_IT1"
      },
      Friday: {
        "09:00-10:00": "2nd Year_IT1",
        "12:30-01:30": "3rd Year_IT3"
      }
    }
  },

  {
    teacher: "Ms. Jasleen Kaur Bhatia",
    schedule: {
      Monday: {
        "11:00-12:00": "3rd Year_IT3",
        "01:30-02:30": "3rd Year_IT2"
      },
      Tuesday: {
        "08:00-09:00": "3rd Year_IT2_B",
        "10:00-11:00": "3rd Year_IT1"
      },
      Wednesday: {
        "09:00-10:00": "3rd Year_IT2",
        "12:30-01:30": "3rd Year_IT1_B"
      },
      Thursday: {
        "08:00-09:00": "3rd Year_IT2_A",
        "09:00-10:00": "3rd Year_IT1_A",
        "11:00-12:00": "3rd Year_IT1"
      },
      Friday: {
        "09:00-10:00": "3rd Year_IT3",
        "12:30-01:30": "3rd Year_IT1",
        "02:30-03:30": "3rd Year_IT2"
      }
    }
  },

  {
    teacher: "Ms. Kapila Malhotra",
    schedule: {
      Monday: {
        "09:00-10:00": "2nd Year_IT3",
        "11:00-12:00": "3rd Year_IT1",
        "12:30-01:30": "4th Year_IT(FSD)",
        "01:30-02:30": "3rd Year_IT1_B"
      },
      Tuesday: {
        "10:00-11:00": "3rd Year_IT1",
        "11:00-12:00": "4th Year_IT(FSD)",
        "12:30-01:30": "3rd Year_IT1_A",
        "01:30-02:30": "2nd Year_IT3"
      },
      Wednesday: {
        "11:00-12:00": "2nd Year_IT3",
        "12:30-01:30": "2nd Year_IT3_B",
        "01:30-02:30": "3rd Year_IT1"
      },
      Thursday: {
        "12:30-01:30": "2nd Year_IT3_A"
      },
      Friday: {
        "09:00-10:00": "4th Year_IT(FSD)",
        "02:30-03:30": "2nd Year_IT3"
      }
    }
  },

  {
    teacher: "Ms. Meenakshi",
    schedule: {
      Monday: {
        "10:00-11:00": "2nd Year_IT2_B"
      },
      Tuesday: {
        "09:00-10:00": "3rd Year_IT1",
        "01:30-02:30": "2nd Year_IT2"
      },
      Wednesday: {
        "08:00-09:00": "2nd Year_IT2_A",
        "10:00-11:00": "3rd Year_IT1",
        "12:30-01:30": "2nd Year_IT2"
      },
      Thursday: {
        "10:00-11:00": "3rd Year_IT1_B"
      },
      Friday: {
        "09:00-10:00": "3rd Year_IT1_A",
        "10:00-11:00": "3rd Year_IT1",
        "12:30-01:30": "2nd Year_IT2"
      }
    }
  },

  {
    teacher: "Ms. Shipra Raheja",
    schedule: {
      Monday: {
        "09:00-10:00": "1st_Year_IT1",
        "10:00-11:00": "3rd Year_IT1"
      },
      Tuesday: {
        "12:30-01:30": "3rd Year_IT1_B",
        "01:30-02:30": "3rd Year_IT1"
      },
      Wednesday: {
        "09:00-10:00": "3rd Year_IT1",
        "10:00-11:00": "4th Year_IT3_A"
      },
      Thursday: {
        "08:00-09:00": "3rd Year_IT1_A",
        "01:30-02:30": "1st_Year_IT1"
      },
      Friday: {
        "10:00-11:00": "1st_Year_IT1_B",
        "12:30-01:30": "3rd Year_IT1",
        "01:30-02:30": "1st_Year_IT1"
      }
    }
  }
];