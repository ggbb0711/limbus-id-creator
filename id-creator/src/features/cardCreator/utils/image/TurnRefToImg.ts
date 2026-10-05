import { domToPng } from 'modern-screenshot';

export default async function TurnRefToImg(ref:React.RefObject<HTMLElement | null>):Promise<string>{
    const el = ref.current!;
    const dataUrl = await domToPng(el, {
        width: el.scrollWidth,
        height: el.scrollHeight,
        style: {
            transform: 'none',
            transformOrigin: 'top left',
        },
        filter: (node) => {
            if (node instanceof HTMLImageElement && node.naturalWidth === 0) {
                return false;
            }
            return true;
        }
    })
    return dataUrl
}