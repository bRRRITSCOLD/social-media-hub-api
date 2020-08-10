import { createParamDecorator } from 'type-graphql';
import Container from 'typedi';

export function RequestContainer(): ParameterDecorator {
  return function (target: any, propertyName: string | symbol, index: number) {
    return createParamDecorator<any>(({ context }) => {
      const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyName);
      const requestContainer = Container.of(context.id);
      return requestContainer.get(paramtypes[index]);
    })(target, propertyName, index);
  };
}
