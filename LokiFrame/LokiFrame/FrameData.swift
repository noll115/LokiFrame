//
//  FrameData.swift
//  LokiFrame
//
//  Created by Noel Gomez on 12/12/22.
//

import Foundation
import SwiftUI
import PhotosUI


@MainActor
class FrameData: ObservableObject {
    @Published var imageResult:Result<[ImageData],Error>?
    @Published var images: [ImageData] = []
    
    let serverPhotosUrl = URL(string: "http://192.168.50.72:8080/photos")!
    
    init(images:[String]) {
        self.imageResult = .success(images.map({ fileName in
            ImageData(filename: fileName ,imageURL: "\(serverPhotosUrl.absoluteString)/\(fileName)")
        }))
    }
    
    init() {
        
    }
    
    
    func getPhotos() async {
        print("getting photos")
        imageResult = nil
        do {
            let (data, _) = try await URLSession.shared.data(from: serverPhotosUrl)
            applyNewImages(data)
        } catch {
            imageResult = .failure(error)
        }
        
    }
    
    func deletePhotos() async {
        print("Delete photos")
        let deletedPhotos = images.filter {$0.toBeDeleted}.map{$0.filename}
        do {
            guard let jsonData = try? JSONEncoder().encode(deletedPhotos) else {
                print("Error: Trying to convert model to JSON data")
                return
            }
            var req = URLRequest(url: serverPhotosUrl)
            req.httpMethod = "DELETE"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = jsonData
            let _ = try await URLSession.shared.data(for: req)
            images = images.filter {!$0.toBeDeleted}
        } catch {
            print(error)
        }
    }
    
    
    func uploadPhotos(_ pickedImages:[PhotosPickerItem]) async {
        print("Upload photos")
        let newImages = try? await withThrowingTaskGroup(of: Data.self, body: { group in
            for pickedImage in pickedImages {
                group.addTask {
                    let res = try await pickedImage.loadTransferable(type: Data.self)
                    let image = UIImage(data: res!)!
                    return image.jpegData(compressionQuality: 1)!
                }
            }
            var resImages : [Data] = []
            for try await res in group {
                resImages.append(res)
            }
            return resImages
        })
        guard let newImages = newImages else {
            return
        }
        do {
            var req = URLRequest(url: serverPhotosUrl)
            req.httpMethod = "POST"
            let boundary = UUID().uuidString
            req.httpMethod = "POST"
            req.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
            var body = Data()
            var newFilenames: [String] = []
            for newImage in newImages {
                let filename = "\(UUID()).jpg"
                newFilenames.append(filename)
                let mimetype = "image/jpeg"
                body.append("--\(boundary)\r\n")
                body.append("Content-Disposition: form-data; name=\"photos\"; filename=\"\(filename)\"\r\n")
                body.append("Content-Type: \(mimetype)\r\n")
                body.append("\r\n")
                body.append(newImage)
                body.append("\r\n")
            }
            body.append("--\(boundary)--\r\n")
            req.httpBody = body
            let (data,_) = try await URLSession.shared.data(for: req)
            applyNewImages(data)
        } catch {
            print(error)
        }
    }
    
    func applyNewImages(_ data:Data) {
        do {
            let fileNames = try JSONDecoder().decode([String].self, from: data)
            let newImages = generateImageDatas(fileNames)
            imageResult = .success(newImages)
            images = newImages
        } catch {
            imageResult = .failure(error)
        }

    }
    
    func generateImageDatas(_ filenames:[String]) -> [ImageData] {
        filenames.map { name in
                .init(filename: name, imageURL: "\(serverPhotosUrl.absoluteString)/\(name)")
        }
    }
    
}

extension Data {
    mutating func append(_ string: String) {
        if let data = string.data(using: .utf8) {
            append(data)
        }
    }
}
