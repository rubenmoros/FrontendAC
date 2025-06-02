import ProductAJAX from './ProductAJAX';
import PersonAJAX from './PersonAJAX';
import EntityAJAX from './EntityAJAX';
import AssociationAJAX from './AssociationAJAX';

class AJAXService {
    static initialize() {
        const productAJAX = new ProductAJAX();
        const personAJAX = new PersonAJAX();
        const entityAJAX = new EntityAJAX();
        const associationAJAX = new AssociationAJAX();

        productAJAX.setAJAXInstances(personAJAX, entityAJAX);
        personAJAX.setAJAXInstances(productAJAX, entityAJAX);
        entityAJAX.setAJAXInstances(productAJAX, personAJAX);
        associationAJAX.setAJAXInstances(productAJAX, personAJAX, entityAJAX);

        return {
            productAJAX,
            personAJAX,
            entityAJAX,
            associationAJAX
        };
    }
}

export default AJAXService;