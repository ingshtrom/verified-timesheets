//
//  ViewController.swift
//  VerifiedTimesheets
//
//  Created by Alex.Hokanson on 1/3/15.
//  Copyright (c) 2015 Alex Hokanson. All rights reserved.
//

import UIKit

class TimesheetsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, UIPopoverPresentationControllerDelegate {
  
  @IBOutlet
  var tableView: UITableView!
  let data: DataManager = DataManager.sharedInstance
  
  override func viewDidLoad() {
    super.viewDidLoad()
    self.title = "Timesheets"
    self.tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
  }

  func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
    var cell: UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell
    cell.textLabel!.text = data.getItem(indexPath.item)
    return cell
  }
  
  func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return data.getCount()
  }
  
  @IBAction func cancelToTimesheetsViewController(segue: UIStoryboardSegue) {
    
  }
  
  @IBAction func saveNewTimesheet(seque: UIStoryboardSegue) {
    
  }
}

