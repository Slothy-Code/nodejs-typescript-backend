import {Container} from 'inversify';
import {services} from '../../services';

const DIContainer = new Container();
for (let service of services) {
    DIContainer.bind(service).toSelf()
}

export default DIContainer;