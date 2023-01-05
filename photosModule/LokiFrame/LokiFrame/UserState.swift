//
//  UserState.swift
//  LokiFrame
//
//  Created by Noel Gomez on 1/4/23.
//

import Foundation
import GoogleSignIn

enum UserState {
    case loggedIn (GIDGoogleUser)
    case notLoggedIn
    case Error(Error)
    
}
