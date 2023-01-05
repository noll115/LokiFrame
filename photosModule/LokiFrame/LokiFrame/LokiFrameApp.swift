//
//  LokiFrameApp.swift
//  LokiFrame
//
//  Created by Noel Gomez on 12/12/22.
//

import SwiftUI
import GoogleSignIn

@main
struct LokiFrameApp: App {
    @StateObject var frameData = FrameData()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(frameData)
                .onOpenURL { url in
                    GIDSignIn.sharedInstance.handle(url)
                }
                .task {
                    await frameData.restoreSignIn()
                    await frameData.getCurrentModulesStatus()
                }
        }
    }
}
