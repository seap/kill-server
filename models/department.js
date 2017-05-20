import _ from 'lodash'
import { nextSeq } from './counter'
import connect from './db'
import logger from '../common/logger'

// insert
export async function insert(doc, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('department')
    const department = _.clone(doc)
    // insert new one
    department.updatedAt = department.createdAt = new Date()
    department.id = await nextSeq('department', db)  // generate increased id
    const result = await collection.insertOne(department)
    logger.log('debug', 'insert department result: %j', result)

    if (result.insertedCount === 1) {
      return department
    }
    throw new Error(`department_insert_error: ${result}`)
  } catch (e) {
    logger.log('error', 'insert department')
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
    const collection = db.collection('department')
    const department = _.clone(doc)
    // insert new one
    department.updatedAt = new Date()
    const result = await collection.updateOne(_.pick(department, ['id']), { $set: doc })
    logger.log('debug', 'update department result: %j', result)

    if (result.matchedCount === 1) {
      return department
    }
    throw new Error(`department_update_error: ${result}`)
  } catch (e) {
    logger.log('error', 'update department')
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
    const collection = db.collection('department')
    const result = await collection.deleteOne({ id })
    logger.log('debug', 'delete department: %j', result)
    if (result.deletedCount === 1) {
      return true
    }
    return false
  } catch (e) {
    logger.log('error', 'remove department, id: %s', id)
    throw e
  } finally {
    conn || (db && db.close())
  }
}


// find by department code
export async function findByCode(code, conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('department')
    const doc = await collection.findOne({ code })
    logger.log('debug', 'find department: %j', doc)
    return doc
  } catch (e) {
    logger.log('error', 'find department by code: %s', code)
    throw e
  } finally {
    conn || (db && db.close())
  }
}

// find department list
export async function findList(conn) {
  let db = null
  try {
    db = conn || await connect() // use outside connection
    const collection = db.collection('department')
    const docs = await collection
      // .find({}, {_id: 0})
      .find({})
      .toArray()
    logger.log('debug', 'find department list: %j', docs)
    return docs
  } catch (e) {
    logger.log('error', 'find department list')
    throw e
  } finally {
    conn || (db && db.close())
  }
}