import _ from 'lodash'
import { nextSeq } from './counter'
import connect from './db'
import logger from '../common/logger'

// insert
export async function insert(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('category')
    const category = _.clone(doc)
    // insert new one
    category.updatedAt = category.createdAt = new Date()
    category.id = await nextSeq('category', db)  // generate increased id
    const result = await collection.insertOne(category)
    logger.log('debug', 'insert category result: %j', result)

    if (result.insertedCount === 1) {
      return category
    }
    throw new Error(`category_insert_error: ${result}`)
  } catch (e) {
    logger.log('error', 'insert category')
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
    const collection = db.collection('category')
    const category = _.clone(doc)
    // insert new one
    category.updatedAt = new Date()
    const result = await collection.updateOne(_.pick(category, ['id']), { $set: category })
    logger.log('debug', 'update category result: %j', result)

    if (result.matchedCount === 1) {
      return category
    }
    throw new Error(`category_update_error: ${result}`)
  } catch (e) {
    logger.log('error', 'update category')
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
    const collection = db.collection('category')
    const result = await collection.deleteOne({ id })
    logger.log('debug', 'delete category: %j', result)
    if (result.deletedCount === 1) {
      return true
    }
    return false
  } catch (e) {
    logger.log('error', 'remove category, id: %s', id)
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// find category list
export async function findList(conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('category')
    const docs = await collection
      // .find({}, {_id: 0})
      .find({})
      .toArray()
    logger.log('debug', 'find category list: %j', docs)
    return docs
  } catch (e) {
    logger.log('error', 'find category list')
    throw e
  } finally {
    conn || (db && db.close())
  }
}