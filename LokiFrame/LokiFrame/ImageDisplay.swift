//
//  ImageDisplay.swift
//  LokiFrame
//
//  Created by Noel Gomez on 12/12/22.
//

import SwiftUI
import NukeUI

struct ImageDisplay: View {
    @Binding var image: ImageData
    @Binding var selectedImg: ImageData?
    var deletingImages: Bool
    let namespace: Namespace.ID
    var springAnim = Animation.spring().speed(3)
    
    var body: some View {
        LazyImage(url: URL(string: image.imageURL)!)
            .matchedGeometryEffect(id: image.id, in: namespace)
            .frame(minWidth: 0, maxWidth: .infinity,minHeight:0,maxHeight: .infinity)
            .aspectRatio(1, contentMode: .fill)
            .cornerRadius(5)
            .overlay(alignment:.topTrailing) {
                if deletingImages && image.toBeDeleted {
                    Image(systemName: "trash.circle.fill")
                        .resizable()
                        .frame(width: 40,height: 40)
                        .foregroundColor(.red)
                        .fontWeight(.bold)
                        .padding(4)
                }
            }
            .scaleEffect(scaleImage)
            .animation(springAnim, value: image.toBeDeleted)
            .animation(springAnim, value: deletingImages)
            .onTapGesture {
                if(deletingImages) {
                    image.toBeDeleted.toggle()
                } else {
                    withAnimation {
                        selectedImg = image
                    }
                    
                }
            }

    }
    
    var scaleImage: Double {
        if deletingImages {
            return image.toBeDeleted ? 0.9 : 1
        }
        return 1.0
    }
}

struct ImageDisplay_Previews: PreviewProvider {
    @State static var imgData = ImageData(filename:"cat.jpeg", imageURL: "http://192.168.50.72:8080/photos/cat.jpeg")
    @State static var selectedImg: ImageData?
    @Namespace static var animation
    
    static var previews: some View {
        ImageDisplay(image: $imgData,
                     selectedImg: $selectedImg,
                     deletingImages: false,
                     namespace: animation)
    }
}
