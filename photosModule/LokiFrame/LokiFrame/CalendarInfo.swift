//
//  CalendarInfo.swift
//  LokiFrame
//
//  Created by Noel Gomez on 1/8/23.
//

import Foundation
struct CalendarInfo: Codable, Identifiable {
    let id: String
    let summary: String
    var enabled: Bool?
}
