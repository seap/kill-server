import { ObjectId } from 'mongodb'
import _ from 'lodash'
import { nextSeq } from './counter'
import connect from './db'
import logger from '../common/logger'

// insert
export async function insert(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('product')
    const product = _.clone(doc)
    // insert new one
    product.updatedAt = product.createdAt = new Date()
    const id = await nextSeq('product', db)  // generate increased id
    product.id = id + ''
    const result = await collection.insertOne(product)
    logger.log('debug', 'insert product result: %j', result)

    if (result.insertedCount === 1) {
      return product
    }
    throw new Error(`product_insert_error: ${result}`)
  } catch (e) {
    logger.log('error', 'insert product')
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// update
export async function update(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('product')
    const product = _.clone(doc)
    // insert new one
    product.updatedAt = new Date()
    // const result = await collection.updateOne({ _id: ObjectId(_id) }, { $set: product })
    const result = await collection.updateOne({ id: product.id }, { $set: product })
    logger.log('debug', 'update product result: %j', result)

    if (result.matchedCount === 1) {
      return product
    }
    throw new Error(`product_update_error: ${result}`)
  } catch (e) {
    logger.log('error', 'update product')
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// delete
export async function remove(id, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('product')
    const result = await collection.deleteOne({ id })
    logger.log('debug', 'delete product: %j', result)
    if (result.deletedCount === 1) {
      return true
    }
    return false
  } catch (e) {
    logger.log('error', 'remove product, id: %s', id)
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// find product by id
export async function findById(id, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('product')
    // const doc = await collection.findOne({ _id: ObjectId(id) })
    const doc = await collection.findOne({ id })
    logger.log('debug', 'find product: %j', doc)
    return doc
  } catch (e) {
    logger.log('error', 'find product, id: %s', id)
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// find product list
export async function findList(condition = {}, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('product')
    const docs = await collection
      .find(condition, { images: 0 })
      .sort({order: -1})
      .toArray()
    logger.log('debug', 'find product list: %j', docs)
    return docs
  } catch (e) {
    logger.log('error', 'find product list')
    throw e
  } finally {
    conn || (db && db.close())
  }
}