const route = require('../../../lib/routes/test')

describe('test route', () => {
  let res
  let req

  beforeEach(() => {
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    }
    req = {
      context: {
        serialport: {
          write: jest.fn((data, cb) => cb()),
        },
      },
    }
  })

  test('works', () => {
    route(req,res)
    expect(req.context.serialport.write.mock.calls.length).toBe(1)
  })
})
