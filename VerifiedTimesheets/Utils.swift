//
//  Utils.swift
//  VerifiedTimesheets
//
//  Created by Alex Hokanson on 3/15/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation

// get the difference between two date times
//
// @return {double} - rounded to a single decimal point
func getTotalTime(startTime: NSDate, endTime: NSDate) -> Double {
  let timeDiff: NSTimeInterval = endTime.timeIntervalSinceDate(startTime)
  return round(timeDiff / 60 / 60 * 10) / 10
}
