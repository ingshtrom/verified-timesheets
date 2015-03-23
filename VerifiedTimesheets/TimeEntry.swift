//
//  TimeEntry.swift
//  VerifiedTimesheets
//
//  Created by Alex Hokanson on 3/17/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation
import CoreData

// this should match the Core Data entity "TimeEntry"
class TimeEntry {
  var created_on : NSDate
  var start_time : NSDate
  var end_time: NSDate
  var notes : String
  var entityRef : NSManagedObject
//  var signature : ??
  
  init (createdOn: NSDate, startTime: NSDate, endTime: NSDate, notes: String, entityRef: NSManagedObject) {
    self.created_on = createdOn
    self.start_time = startTime
    self.end_time = endTime
    self.notes = notes
    self.entityRef = entityRef
  }
}