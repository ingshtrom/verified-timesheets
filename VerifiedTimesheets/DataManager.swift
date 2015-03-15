//
//  DataManager.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 1/3/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//
//  a lot of this was grabbed from http://www.raywenderlich.com/85578/first-core-data-app-using-swift

import UIKit
import CoreData

class DataManager {
  struct Static {
    static var onceToken : dispatch_once_t = 0
    static var instance : DataManager? = nil
  }
  
  class var sharedInstance : DataManager {
    dispatch_once(&Static.onceToken) {
      Static.instance = DataManager()
    }
    return Static.instance!
  }
  
  let managedObjectContext = (UIApplication.sharedApplication().delegate as AppDelegate).managedObjectContext

  var store: [NSManagedObject] = [NSManagedObject]()
    
  private init() {
    let appDelegate = UIApplication.sharedApplication().delegate as AppDelegate
    let managedContext = appDelegate.managedObjectContext!
    let fetchRequest = NSFetchRequest(entityName:"TimeEntry")
    var error: NSError?
    
    let fetchedResults = managedContext.executeFetchRequest(fetchRequest, error: &error) as [NSManagedObject]?
    
    if let results = fetchedResults {
      store = results
    } else {
      println("Could not fetch \(error), \(error!.userInfo)")
    }
  }

  func addItem(startTimeDate: NSDate, endTimeDate: NSDate, notes: String) {
    let entity =  NSEntityDescription.entityForName("TimeEntry", inManagedObjectContext: managedObjectContext!)
    let timeEntry = NSManagedObject(entity: entity!, insertIntoManagedObjectContext: managedObjectContext)
    
    timeEntry.setValue(NSDate(), forKey: "created_on")
    timeEntry.setValue(startTimeDate, forKey: "start_time")
    timeEntry.setValue(endTimeDate, forKey: "end_time")
    
    var error: NSError?
    if managedObjectContext?.save(&error) != nil {
      println("Could not save \(error), \(error?.userInfo)")
    } else {
      println("saved item successfully")
    }

    return store.append(timeEntry)
  }
  
  func getItem(index: Int) -> NSManagedObject {
    return store[index]
  }
  
  func removeItem(index: Int) -> NSManagedObject {
    return store.removeAtIndex(index)
  }
  
  func getCount() -> Int {
    return store.count
  }
  
}