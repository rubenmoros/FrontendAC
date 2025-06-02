import ProductAJAX from './ProductAJAX';
import PersonAJAX from './PersonAJAX';
import EntityAJAX from './EntityAJAX';

class AJAXService {
    static initialize() {
        const productAJAX = new ProductAJAX();
        const personAJAX = new PersonAJAX();
        const entityAJAX = new EntityAJAX();

        productAJAX.setAJAXInstances(personAJAX, entityAJAX);
        personAJAX.setAJAXInstances(productAJAX, entityAJAX);
        entityAJAX.setAJAXInstances(productAJAX, personAJAX);

        return {
            productAJAX,
            personAJAX,
            entityAJAX
        };
    }
}

export default AJAXService;