//
//  LokiFrameUrl.swift
//  LokiFrame
//
//  Created by Noel Gomez on 1/9/23.
//

import Foundation

enum LokiFrameUrl: String {
    case photos = "/photos"
    case authCode = "/cal/authCode"
    case logout = "/cal/logout"
    case refresh = "/cal/refresh"
    case calendars = "/cal/calendars"
    case moduleHide = "/hide"
    
    private static let BASE_URL = "http://192.168.50.72:8080"
    
    var url: URL {
        guard let url = URL(string: LokiFrameUrl.BASE_URL) else {
            preconditionFailure("The url in not valid")
        }
        return url.appending(path: self.rawValue)
    }
}
