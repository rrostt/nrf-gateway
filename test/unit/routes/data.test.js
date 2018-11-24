const data = require('../../../lib/routes/data')

describe('data route', () => {
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
      body: {
        address: [0, 0, 0, 0, 0],
        data: [],
      },
    }
  })

  test('validate address', () => {
    data(req, res)
    expect(res.send.mock.calls[0][0]).toBe('thanks')
  })

  test('address cannot be shorter than 5 bytes', () => {
    req.body.address = [0, 0, 0, 0]
    data(req, res)
    expect(res.status.mock.calls[0][0]).toBe(500)
  })

  test('address cannot be longer than 5 bytes', () => {
    req.body.address = [0, 0, 0, 0, 0, 0]
    data(req, res)
    expect(res.status.mock.calls[0][0]).toBe(500)
  })

  test('address must only contain bytes (<256)', () => {
    req.body.address = [0, 0, 256, 0, 0]
    data(req, res)
    expect(res.status.mock.calls[0][0]).toBe(500)
  })

  test('address must only contain bytes (positive)', () => {
    req.body.address = [0, 0, -256, 0, 0]
    data(req, res)
    expect(res.status.mock.calls[0][0]).toBe(500)
  })

  test('data cannot be longer than 32 bytes', () => {
    req.body.data = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ] // 33 0s
    data(req, res)
    expect(res.status.mock.calls[0][0]).toBe(500)
  })

  test('data must be bytes (<256)', () => {
    req.body.data = [256]
    data(req, res)
    expect(res.status.mock.calls[0][0]).toBe(500)
  })

  test('data must be bytes (positive)', () => {
    req.body.data = [-1]
    data(req, res)
    expect(res.status.mock.calls[0][0]).toBe(500)
  })

  test('writes 37 bytes to serial', () => {
    data(req, res)
    expect(req.context.serialport.write.mock.calls[0][0].length).toBe(37)
  })
})
