import { Carousel } from 'react-bootstrap';
import banner1 from '/images/banner1.jpg';
import banner2 from '/images/banner2.png';
import banner3 from '/images/banner3.png';
import banner4 from '/images/banner4.png';

const banners = [
	{ id: 1, image: banner1, alt: 'Banner Clássico e Luxuoso' },
	{ id: 2, image: banner2, alt: 'Banner Fresco e Botânico' },
	{ id: 3, image: banner3, alt: 'Banner Misterioso e Amadeirado' },
	{ id: 4, image: banner4, alt: 'Banner Moderno e Minimalista' }
];

export default function BannerCarousel() {
	return (
		<Carousel
			indicators={true}
			controls={true}
			interval={4000}
			pause="hover"
			fade={false}
			className="banner-carousel"
		>
			{banners.map((banner) => (
				<Carousel.Item key={banner.id}>
					<img
						className="banner-img"
						src={banner.image}
						alt={banner.alt}
					/>
				</Carousel.Item>
			))}
		</Carousel>
	);
}