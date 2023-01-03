//
//  ContentView.swift
//  LokiFrame
//
//  Created by Noel Gomez on 12/12/22.
//

import SwiftUI
import PhotosUI
import NukeUI

struct ContentView: View {
    @EnvironmentObject var frameData: FrameData
    @State var photosPicked: [PhotosPickerItem] = []
    @State private var deletingImages = false
    @State var pickingPhotos = false
    @State var selectedImg : ImageData?
    @Namespace private var animation
    
    init() {
        UINavigationBar.appearance().titleTextAttributes = [.font : UIFont.preferredFont(forTextStyle:.title1)]
    }
    
    var body: some View {
        NavigationStack {
            VStack {
                ImageDisplayList(selectedImg: $selectedImg,
                                 namespace: animation,
                                 deletingImages: $deletingImages
                )
                if deletingImages {
                    deleteBtn
                } else {
                    photoPickerBtn
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationTitle("Photos")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        deletingImages.toggle()
                        
                    } label: {
                        Image(systemName: deletingImages ? "trash.slash" : "trash")
                            .symbolRenderingMode(deletingImages ? .monochrome : .multicolor)
                    }
                }
            }
        }
        .overlay(imagePreview)
        .photosPicker(isPresented: $pickingPhotos,
                      selection: $photosPicked,
                      maxSelectionCount: 6,
                      matching: .images,
                      photoLibrary:.shared())
        .onChange(of: photosPicked) { newValue in
            Task {
                await frameData.uploadPhotos(photosPicked)
                photosPicked = []
            }
        }
        .task {
            await frameData.getPhotos()
        }
        
    }
    
    @ViewBuilder var deleteBtn: some View {
        let allNotSelected = frameData.images.allSatisfy({ imgData in
            !imgData.toBeDeleted
        })
        
        Button("Delete Photos") {
            Task {
                await frameData.deletePhotos()
                deletingImages = false
            }
        }
        .disabled(allNotSelected)
        .foregroundColor(.red.opacity(allNotSelected ? 0.3 : 1))
        .animation(.easeInOut, value: allNotSelected)
    }
    
    var photoPickerBtn: some View {
        Button("Add Photos") {
            pickingPhotos = true
        }
    }
    
    @ViewBuilder var imagePreview: some View {
        if let selectedImg = selectedImg {
            Group {
                LazyImage(url: URL(string: selectedImg.imageURL)!,resizingMode: .aspectFit)
                    .matchedGeometryEffect(id: selectedImg.id,
                                           in: animation)
            }
            .frame(maxWidth: .infinity,maxHeight: .infinity)
            .padding()
            .background(.ultraThinMaterial, in:Rectangle())
            .onTapGesture {
                withAnimation {
                    self.selectedImg = nil
                }
                
            }
            
            .ignoresSafeArea()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static let catImg = "cat.jpeg"
    static var previews: some View {
        ContentView()
            .environmentObject(
                FrameData(images: [catImg,
                                   catImg,
                                   catImg,
                                   catImg
                                  ]))
    }
}
