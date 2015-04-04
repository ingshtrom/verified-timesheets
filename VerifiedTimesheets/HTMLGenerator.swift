//
//  HTMLGenerator.swift
//  VerifiedTimesheets
//
//  Created by Alex Hokanson on 4/4/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import Foundation

class HTMLGenerator {
  class func fromCoreData () -> NSString {
    var html: String = "".join([
      "<html>",
        "<body>",
          "<h1>Time Entries!</h1>",
          "<table>",
            "<tr>",
              "<th>Notes</th>",
              "<th>Start Time</th>",
              "<th>End Time</th>",
              "<th>Total Time</th>",
              "<th>Manager Initials</th>",
            "</tr>"
      ])
    let data = DataManager.sharedInstance.getAllItems()
    for cur in data {
      let notes: String = cur.valueForKey("notes") as String
      let startTime: NSDate = cur.valueForKey("start_time") as NSDate
      let startTimeFormatted: NSString = getFormatter().stringFromDate(startTime)
      let endTime: NSDate = cur.valueForKey("end_time") as NSDate
      let endTimeFormatted: NSString = getFormatter().stringFromDate(endTime)
      let totalTime: NSNumber = getTotalTime(startTime, endTime)
      var managerInitials: NSData = cur.valueForKey("manager_initials") as NSData
      managerInitials = UIImageJPEGRepresentation(UIImage(data: managerInitials, scale: 0.25)!, 1.0)
      let managerInitialsBase64 = managerInitials.base64EncodedStringWithOptions(nil)
      html += "".join([
        "<tr>",
          "<th>\(notes)</th>",
          "<th>\(startTimeFormatted)</th>",
          "<th>\(endTimeFormatted)</th>",
          "<th>\(totalTime)</th>",
          "<th><img style=\"width:50px;height:50px;\" src=\"data:image/jpg;base64, \(managerInitialsBase64)\" /></th>",
        "</tr>"
      ])
    }
    html += "</table></body></html>"
    println(html)
    return html
  }
}