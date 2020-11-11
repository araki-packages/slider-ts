export const deltaAnimation = (
  cb: (deltaTime: number, elapsedTime: number) => void
) => {
  let prevTime: number | null = null;
  let elapsedTime = 0;
  let id: null | number = null;
  const tick = (currentTime: number) => {
    id = window.requestAnimationFrame(tick);
    if (prevTime == null) prevTime = currentTime - 16;
    const deltaTime = -prevTime + currentTime;
    elapsedTime += deltaTime;
    cb(deltaTime, elapsedTime);
  };
  id = window.requestAnimationFrame(tick);

  return () => {
    if (id === null) return;
    window.cancelAnimationFrame(id);
  };
};
