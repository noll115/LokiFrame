//
//  ImageDisplayList.swift
//  LokiFrame
//
//  Created by Noel Gomez on 12/12/22.
//

import SwiftUI

struct ImageDisplayList: View {
    @EnvironmentObject var frameData: FrameData
    @Binding var selectedImg : ImageData?
    let namespace: Namespace.ID
    let deletingImages: Bool
    
    private let columns = [GridItem(.flexible(),spacing: 3),
                           GridItem(.flexible(),spacing: 3),
                           GridItem(.flexible(),spacing: 3)]
    
    var body: some View {
        
        ScrollView {
            if let imageResult = frameData.imageResult {
                switch imageResult {
                case .success:
                    gridList
                case .failure(let error):
                    errorView(error: error)
                }
            } else {
                ProgressView()
            }
        }.refreshable {
            Task {
                await frameData.getPhotos()
            }
        }
        .onChange(of: deletingImages) { deleting in
            if(!deleting) {
                frameData.images = frameData.images.map({ imgData in
                    if imgData.toBeDeleted {
                        return ImageData(filename:imgData.filename,
                                         imageURL: imgData.imageURL,
                                         toBeDeleted: false)
                    }
                    return imgData
                })
            }
        }
    }
    
    
    var gridList: some View {
        LazyVGrid(columns: columns,spacing: 3) {
            ForEach($frameData.images) { image in
                if selectedImg?.id != image.id {
                    ImageDisplay(image: image,
                                 selectedImg: $selectedImg,
                                 deletingImages: deletingImages,
                                 namespace: namespace)
                } else {
                    Color(UIColor.systemBackground)
                }
            }
        }
    }
    
    func errorView(error:Error) -> some View {
        Text(error.localizedDescription)
    }
    
}

struct ImageDisplayList_Previews: PreviewProvider {
    static let catImg = "cat.jpeg"
    @State static var selectedImg : ImageData? = nil
    @Namespace static var animation
    
    static var previews: some View {
        ImageDisplayList(selectedImg: $selectedImg, namespace: animation, deletingImages: false)
            .environmentObject(
                FrameData(images: [catImg,
                                   catImg,
                                   catImg,
                                   catImg
                                  ]))
    }
}
