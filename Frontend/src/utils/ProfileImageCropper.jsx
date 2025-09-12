import React, { useRef, useState, useCallback } from "react";
import ReactCrop from "react-image-crop";


export default function CircularImageCropper() {
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const [crop, setCrop] = useState({
  unit: "%",
  width: 50,
  height: 50,
  x: 25,
  y: 25,
  aspect: 1
});
    const [completedCrop, setCompletedCrop] = useState(null);

    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [showGrid, setShowGrid] = useState(true);

    const onSelectFile = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setUpImg(objectUrl);
        }
    };

    const onImageLoaded = useCallback((img) => {
        imgRef.current = img;
        
    }, []);

    const generateCroppedImage = useCallback(() => {
        if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const pixelCrop = completedCrop;

        canvas.width = Math.floor(pixelCrop.width);
        canvas.height = Math.floor(pixelCrop.height);

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.beginPath();
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(cx, cy);
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        const sx = pixelCrop.x;
        const sy = pixelCrop.y;
        const sw = pixelCrop.width;
        const sh = pixelCrop.height;

        ctx.translate(cx, cy);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(image, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);

        ctx.restore();
    }, [completedCrop, rotate, scale]);

    React.useEffect(() => {
        generateCroppedImage();
    }, [completedCrop, rotate, scale, generateCroppedImage]);

    const onDownload = () => {
        if (!previewCanvasRef.current) return;
        const canvas = previewCanvasRef.current;
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "crop-circle.png";
            link.href = url;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    const resetAll = () => {
        if (upImg) URL.revokeObjectURL(upImg);
        setUpImg(null);
        setCrop({ unit: "%", width: 50, aspect: 1 });
        setCompletedCrop(null);
        setScale(1);
        setRotate(0);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-3">Circular Image Cropper</h2>
            <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onSelectFile}
                        className="hidden"
                    />

                    {upImg ? (
                        <div className="border rounded p-2 bg-white">
                            <ReactCrop
                                src={upImg}
                                crop={crop}
                                ruleOfThirds={showGrid}
                                onImageLoaded={onImageLoaded}
                                onComplete={(c) => setCompletedCrop(c)}
                                onChange={(newCrop) => setCrop(newCrop)}
                                style={{ maxWidth: "100%" }}
                            />
                        </div>
                    ) : (
                        <label
                            className=" w-72 h-72 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer bg-gray-50 text-gray-500"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            کلیک کنید و عکس انتخاب کنید
                        </label>
                    )}
                </div>

                <div className="w-[320px]">
                    <h3 className="font-semibold mb-2">پیش‌ نمایش دایره‌ای</h3>
                    <label
                        className="w-72 h-72 rounded-full overflow-hidden border flex items-center justify-center bg-gray-50 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <canvas
                            ref={previewCanvasRef}
                            style={{ width: "100%", height: "100%", display: completedCrop ? "block" : "none" }}
                        />

                        {!completedCrop && (
                            <div className="text-center text-sm text-gray-500 px-4">
                                وقتی انتخابی کامل شود، اینجا پیش‌نمایش دایره‌ای ظاهر می‌شود.
                               
                            </div>
                        )}
                    </label>

                    <div className="mt-3 flex gap-2">
                        <button
                            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                            onClick={onDownload}
                            disabled={!completedCrop}
                        >
                            دانلود PNG دایره‌ای
                        </button>
                        <button className="px-3 py-2 rounded border" onClick={resetAll}>
                            پاک کردن
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
