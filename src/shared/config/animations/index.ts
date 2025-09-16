export const animations = {
  table: {
    flash: {
      first: {
        initial: {
          y: -40,
          x: 0,
          opacity: 0,
          rotate: 0,
        },
        animate: {
          y: 0,
          x: [0, -10, 10, -8, 8, -5, 5, 0],
          rotate: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 500,
            damping: 15,
            mass: 0.8,
            x: {
              duration: 0.6,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
              ease: 'easeInOut',
            },
          },
        },
        exit: {
          opacity: 0,
          height: 0,
          y: -20,
          transition: {
            duration: 0.35,
            ease: 'easeInOut',
            opacity: {
              duration: 0.2,
            },
          },
        },
      },

      last: {
        initial: {
          y: 30,
          opacity: 0,
          scale: 0.95,
        },
        animate: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 150,
            damping: 15,
            mass: 0.5,
            duration: 0.7,
          },
        },
        exit: {
          opacity: 0,
          x: 50,
          transition: {
            duration: 0.25,
            ease: 'easeIn',
          },
        },
      },

      default: {
        initial: {
          y: 15,
          opacity: 0,
          scale: 0.98,
        },
        animate: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.5,
          },
        },
        exit: {
          opacity: 0,
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
          transition: {
            duration: 0.4,
            ease: 'easeInOut',
            opacity: {
              duration: 0.2,
            },
          },
        },
      },
    },
    flashAndShake: {
      initial: {
        y: -40,
        x: 0,
        opacity: 0,
        backgroundColor: 'rgba(251, 191, 36, 0)',
        rotate: 0,
      },
      animate: {
        y: 0,
        x: [0, -10, 10, -8, 8, -5, 5, 0],
        rotate: 0,
        opacity: 1,
        backgroundColor: ['rgba(251, 191, 36, 0)', 'rgba(251, 191, 36, 0.6)', 'rgba(251, 191, 36, 0)'],
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 15,
          mass: 0.8,
          x: {
            duration: 0.6,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
            ease: 'easeInOut',
          },
          backgroundColor: {
            duration: 0.8,
            times: [0, 0.3, 0.9],
            ease: 'easeInOut',
          },
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        rotate: -3,
        transition: {
          duration: 0.25,
          ease: 'easeIn',
        },
      },
    },
  },
  list: {
    flashAndShake: {
      first: {
        initial: {
          y: -40,
          x: 0,
          opacity: 0,
          rotate: 0,
        },
        animate: {
          y: 0,
          x: [0, -10, 10, -8, 8, -5, 5, 0],
          rotate: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 500,
            damping: 15,
            mass: 0.8,
            x: {
              duration: 0.6,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
              ease: 'easeInOut',
            },
          },
        },
        exit: {
          opacity: 0,
          height: 0,
          y: -20,
          transition: {
            duration: 0.35,
            ease: 'easeInOut',
            opacity: {
              duration: 0.2,
            },
          },
        },
      },
      last: {
        initial: {
          y: 30,
          opacity: 0,
          scale: 0.95,
        },
        animate: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 150,
            damping: 15,
            mass: 0.5,
            duration: 0.7,
          },
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          transition: {
            duration: 0.2,
            ease: 'easeOut',
          },
        },
      },

      default: {
        initial: {
          y: 15,
          opacity: 0,
          scale: 0.98,
        },
        animate: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.5,
          },
        },
        exit: {
          opacity: 0,
          x: -30,
          transition: {
            duration: 0.3,
            ease: 'easeIn',
          },
        },
      },
      moved: {
        initial: {
          opacity: 1,
          boxShadow: '0 0 0 0 rgba(251, 191, 36, 0)',
        },
        animate: {
          boxShadow: [
            '0 0 0 0 rgba(251, 191, 36, 0)',
            '0 0 0 4px rgba(251, 191, 36, 0.6)',
            '0 0 0 0 rgba(251, 191, 36, 0)',
          ],
          transition: {
            boxShadow: {
              duration: 0.8,
              times: [0, 0.5, 1],
            },
          },
        },
        exit: {
          opacity: 0,
          scale: 0.85,
          transition: {
            duration: 0.25,
            ease: 'easeIn',
          },
        },
      },
    },
  },
};
