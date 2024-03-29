import React from "react";
import styles from "@site/src/components/slides/slides.module.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"

// https://github.com/xiaolin/react-image-gallery
// https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
const images = Array.from({length: 22}, (_, i) => {
        let ix = i; // starting at 0 intentionally
        return {
            original: "/img/slides/introduction-to-toolset-" + ix + ".svg",
            thumbnail: "/img/slides/introduction-to-toolset-" + ix + ".svg",
            originalAlt: "Introduction to Toolset slide " + ix,
            originalTitle: "Introduction to Toolset slide " + ix,
            thumbnailAlt: "Introduction to Toolset slide " + ix,
            thumbnailTitle: "Introduction to Toolset slide " + ix,
            loading: "lazy"
        }
    }
);

export default function Slides() {
    return (
        <main>
            <section className={styles.slidesContainer}>
                <div className="container">
                    <ImageGallery items={images}
                                  thumbnailPosition={"bottom"}
                                  showBullets={false}
                                  showNav={true}
                                  showIndex={true}
                                  slideInterval={4000}
                                  lazyLoad={true}
                    />
                </div>
            </section>
        </main>
    );
}
