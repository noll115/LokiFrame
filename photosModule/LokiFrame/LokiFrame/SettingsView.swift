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
                let result = frameData.modulesHidden
                HStack {
                    Text(module.description.capitalized)
                    Spacer()
                    if let result = result, case .success(let modules) = result {
                        Button {
                            Task {
                                await frameData.toggleModule(module: module)
                            }
                        } label: {
                            let hidden = modules.contains(module)
                            Image(systemName: hidden ? "eye.slash" : "eye")
                        }
                        .buttonStyle(.bordered)
                    } else {
                        ProgressView()
                            .scaledToFit()
                    }
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
            if case .loggedIn = frameData.user {
                Group {
                    Button("Refresh Calendar") {
                        Task {
                            await frameData.refreshCalendar()
                        }
                    }
                }
                
            } else if case .notLoggedIn = frameData.user {
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
                    HStack {
                        Image(systemName: "person.fill")
                            .foregroundColor(.blue)
                        Text(user.profile?.email ?? "")
                    }
                    .font(.subheadline)
                }
            }
            
        } footer: {
            switch frameData.user {
                
            case .Error(let error):
                Text(error.localizedDescription)
                    .foregroundColor(.red)
            default:
                EmptyView()
            }
            
        }
        .headerProminence(.increased)
        if case .loggedIn = frameData.user , case .success(let calendars) = frameData.calendars {
            Section {
                ForEach(calendars) { cal in
                    Button {
                        Task {
                            await frameData.toggleCalendar(calendarId:cal.id)
                        }
                    } label: {
                        HStack {
                            Text(cal.summary)
                            Spacer()
                            if let enabled = cal.enabled {
                                if enabled {
                                    Image(systemName: "checkmark")
                                }
                            } else {
                                ProgressView()
                            }
                        }
                    }
                }
                
            } header: {
                Text("Calendars")
            } footer: {
                if case .loggedIn = frameData.user {
                    HStack {
                        Spacer()
                        Button(action: {
                            frameData.googleSignOut()
                        }, label: {
                            Text("Sign out")
                                .font(.subheadline)
                        })
                        .foregroundColor(.red)
                    }
                }
            }
            
        }
    }
    
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(FrameData())
    }
}
