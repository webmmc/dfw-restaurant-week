import styles from './styles/restaurant-meta.module.scss';
import Container from "../components/container";
import { CMS_NAME, CMS_URL } from "../lib/constants";

export default function RestaurantMeta({ restaurantData, metaType }){
  return (
    <Container>
        <section className={`${styles.meta} my-16`}>

            {metaType === 'weeks' && (
                <div className={`${styles.meta} flex flex-wrap align-center justify-between`}>
                    <div className={`${styles.weeks || ''} ${styles.metawidth} border-2 border-solid text-gray p-6`}>
                        <div className="text-black">
                            <h4 className="uppercase mb-3">Weeks Participating</h4>
                            <div className="flex flex-wrap">
                                {restaurantData.weeks.map((week, index) => (
                                    <div className="w-1/2 py-1" key={index}>{week}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.meals || ''} ${styles.metawidth} border-2 border-solid text-gray p-6`}>
                        <div className="text-black">
                            <h4 className="uppercase mb-3">Meals Available</h4>
                            <div className="flex flex-wrap">
                                {restaurantData.selection.map((meal, index) => (
                                    <div className="w-1/2 py-1" key={index}>{meal}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {metaType === 'menu' && (
                restaurantData.menu && (
                    <div>
                        <h4 className="uppercase mb-2 mt-12">Menu</h4>
                        <div className={`${styles.menu || ''} p-0`}>
                        <iframe src={restaurantData.menu} title="PDF Viewer" className={`${styles.iframe || ''} w-full h-full`}></iframe>
                        <a target="_blank" href={restaurantData.menu} className="site-btn site-btn--secondary float-right my-2">open in new window</a>
                        <div className="clear-right"></div>
                        </div>
                    </div>
                )
            )}


            {metaType === 'map' && (
                restaurantData.address && (
                    <div>
                        <h4 className="uppercase mb-3">Map</h4>
                        <div className={`${styles.map || ''} p-0`}>
                        <iframe
                            title="Google Map"
                            className={`${styles.iframe || ''} w-full h-full`}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${encodeURIComponent(restaurantData.address)}(${encodeURIComponent(restaurantData.name)})!6i13!3m1!1sen!5m1!1sen`}
                        ></iframe>
                        <a target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurantData.address)}(${encodeURIComponent(restaurantData.name)}`} className="site-btn site-btn--secondary float-right my-2">get directions</a>
                        <div className="clear-right"></div>
                        </div>
                    </div>
                )
            )}


        </section>
        
    </Container>
  );
}
