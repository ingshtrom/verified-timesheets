//
//  DataManager.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 1/3/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation

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
  
  private init() {
    
  }

  func addItem() {
    
  }
  
  func getItem() {
    
  }
  
  func removeItem() {
    
  }
  
  func getCount() {
    
  }
  
}