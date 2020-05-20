import { numberForColor } from ".";

export const ExampleElementChildren = (
  color: string,
  backgroundColor: string
) => {
  const element = document.createElement('div');
  element.style.width = '50vw';
  element.style.height = '20vh';
  element.style.textAlign = 'center';
  element.style.color = color;
  console.log(backgroundColor);
  element.style.backgroundColor = backgroundColor;
  return element;
};

export const Wrap = (elements: HTMLElement[]) => {
  const wrapElement = document.createElement('div');
  wrapElement.style.width = '100%';
  wrapElement.style.maxWidth = '100%';
  wrapElement.style.overflowX = 'hidden';

  const element = document.createElement('div');
  element.style.display = 'inline-flex';
  elements.forEach((children) => {
    element.appendChild(children);
  });
  wrapElement.appendChild(element);
  return wrapElement;
};

export const CreateTestElement = () => {
  const elements = Array(10)
    .fill(1)
    .map((_, index, array) => {
      const content = (index / array.length) * 0xFFFFFF;
      const el = ExampleElementChildren('#000', numberForColor(content));
      console.log('hoge');
      el.textContent = index.toString();
      return el;
    });
  const elWrap = Wrap(elements);
  return elWrap;
};