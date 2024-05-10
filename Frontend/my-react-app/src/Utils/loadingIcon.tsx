const ButtonLoadingIcon = ({ color, size }: { color?: string; size?: string }) => {
    // Calculate dynamic class names
    const borderColor = color ? `${color}_transparent_transparent_transparent` : 'white_transparent_transparent_transparent';
    // Render the JSX with dynamic class names
    const col = color =="red" ? "red" : color =="green" ?'green' : color =="blue" ? "blue": "white"
    return (
        <span className={`lds-ring flex items-center justify-center relative ${size ? size : "h-6 w-6"}`}>
            <span className={`absolute ${size ? size : "w-6 h-6"} m-2 border-[3px]   rounded-[50%] border-[${col}_transparent_transparent_transparent] animate-spin`}></span>
            <span className='delay-75'></span>
            <span className='delay-100'></span>
            <span className='delay-150'></span>
        </span>
    );
};

export default ButtonLoadingIcon;
