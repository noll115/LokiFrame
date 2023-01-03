//
//  LokiFrameApp.swift
//  LokiFrame
//
//  Created by Noel Gomez on 12/12/22.
//

import SwiftUI

@main
struct LokiFrameApp: App {
    @StateObject var frameData = FrameData()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(frameData)
        }
    }
}
