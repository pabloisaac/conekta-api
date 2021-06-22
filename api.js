const Oid = require('mongodb').ObjectID
const { resError } = require('./errors')

exports.gLst = db => (req, res) => {
    db.collection(req.params.entity)
      .find({})
      .toArray((err, doc) =>
        err ? resError(res, 'SERVER_ERROR') : res.json(doc)
      )
}

exports.gGet = db => (req, res) => {
    const { _id } = req.params
    db.collection(req.params.entity)
      .findOne({ _id: Oid(_id) },
        (err, usr) => {
          if (err || !_id) {
            return resError(res, 'BAD_REQUEST', 'No _id to get')
          }
          return res.json(usr)
        }
      )
}

exports.gPost = db => (req, res) => {
    const data = req.body
    if (!data) {
        return resError(res, 'BAD_REQUEST', 'No data to post')
    }
    db.collection(req.params.entity).insertOne(data, (err, doc) =>
        err ? resError(res, 'SERVER_ERROR') : res.json(doc)
    )
}

exports.gPut = db => async (req, res) => {
    const data = req.body
    if (!data || !('_id' in data)) {
      return resError(res, 'BAD_REQUEST', 'No data to put')
    }
    const updData = { ...data }
    delete updData._id
    try {
      const doc = await db
        .collection(req.params.entity)
        .updateOne({ _id: Oid(data._id) }, { $set: updData })
      res.json(doc)
    } catch (err) {
      return resError(res, 'SERVER_ERROR')
    }
}

exports.gDel = db => (req, res) => {
    const { _id } = req.params
    if (!_id) {
      return resError(res, 'BAD_REQUEST', 'No _id to delete')
    }
    db.collection(req.params.entity).deleteOne({ _id: Oid(_id) }, (err, doc) =>
    err ? resError(res, 'SERVER_ERROR') : res.json(doc)
    )
}