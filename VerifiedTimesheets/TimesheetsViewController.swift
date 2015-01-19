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
  var tableView: UITableView!;
  
  override func viewDidLoad() {
    super.viewDidLoad();
    
    self.title = "Timesheets";
    
    self.tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell");
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning();
  }

  func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
    var cell: UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell") as UITableViewCell;
    cell.textLabel!.text = "foobar";
    return cell;
  }
  
  func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    if (section == 0) {
      return 5;
    }
    return 0;
  }
  
  @IBAction func addButtonClicked(sender: AnyObject?) {
    println("addButtonClicked()");
    self.displayNewRecordPopover();
  }
  
  private func displayNewRecordPopover() {
    let popoverController = NewRecordViewController();
    
//    let nav = UINavigationController(rootViewController: popoverController);
//    nav.modalPresentationStyle = UIModalPresentationStyle.Popover;
//    
//    let popover = nav.popoverPresentationController;
//    popover!.delegate = self;
//    popover!.sourceRect = self.view.bounds;
    
    self.presentViewController(popoverController, animated: true, completion: nil)
  }
}

