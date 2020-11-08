const y = (x: number) => x * x;

describe("index.ts test", () => {
  it('calc y',  () => {
    expect(y(10)).toBe(Math.pow(10, 2));
    expect(y(11)).toBe(Math.pow(11, 2));
  });
});
