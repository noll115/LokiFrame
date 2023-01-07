//
//  SettingsView.swift
//  LokiFrame
//
//  Created by Noel Gomez on 1/3/23.
//

import SwiftUI
import GoogleSignInSwift

struct SettingsView: View {
    @EnvironmentObject var frameData: FrameData
    let modules:[FrameModules] = [.weather,.clock,.calendar]
    
    var body: some View {
        List{
            moduleList
            calendarSettings
        }
        .navigationTitle("Settings")
        .task {
            await frameData.getCurrentModulesStatus()
        }
    }
    
    func handleSignIn() {
        guard let viewController = (UIApplication.shared.connectedScenes.first as? UIWindowScene)?.keyWindow?.rootViewController else {
            return
        }
        Task {
            await frameData.googleSignIn(viewController: viewController)
        }
        
    }
    
    @ViewBuilder var moduleList: some View {
            Section {
                ForEach(modules,id: \.self) { module in
                    let hidden = frameData.modulesHidden.contains(module)
                    HStack {
                        Text(module.description.capitalized)
                        Spacer()
                        Button {
                            Task {
                                await frameData.toggleModule(module: module)
                            }
                        } label: {
                            Image(systemName: hidden ? "eye.slash" : "eye")
                        }
                        .buttonStyle(.bordered)
                    }
                }
            } header: {
                HStack {
                    Text("Modules")
                    Spacer()
                    Button {
                        Task{
                            await frameData.getCurrentModulesStatus()
                        }
                    } label: {
                        Image(systemName: "arrow.triangle.2.circlepath")
                    }
                }
            }
            .headerProminence(.increased)
        
    }
    
    @ViewBuilder var calendarSettings: some View {
        Section {
            switch frameData.user  {
            case .loggedIn:
                Button("Refresh Calendar") {
                    
                }
                Button("Sign out") {
                    frameData.googleSignOut()
                }
            case .Error,.notLoggedIn:
                Button(action: {
                    handleSignIn()
                }, label: {
                    Text("Sign into Google")
                })
                
            }
        } header: {
            HStack {
                Text("Calendar")
                if case .loggedIn(let user) = frameData.user {
                    Spacer()
                    Label(user.profile?.email ?? "", systemImage: "person.fill")
                }
                
            }
          
        } footer: {
            if case .Error(let error) = frameData.user {
                Text(error.localizedDescription)
                    .foregroundColor(.red)
            }
        }
        .headerProminence(.increased)
        
    }
    
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(FrameData())
    }
}
