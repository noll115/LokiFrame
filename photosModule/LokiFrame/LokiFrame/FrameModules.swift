//
//  ServerModules.swift
//  LokiFrame
//
//  Created by Noel Gomez on 1/4/23.
//

import Foundation

enum FrameModules: String, Codable, CustomStringConvertible {
    case calendar = "calendarModule"
    case clock
    case weather
    
    var description: String {
        switch self {
        case .calendar:
            return "calendar"
        default:
            return self.rawValue
        }
    }
    
}
