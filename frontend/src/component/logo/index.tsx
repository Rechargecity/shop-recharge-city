import shopSvg from "../../asset/shop.svg";
import rechargeCitySvg from "../../asset/recharge-city.svg";

export const Logo = () => (
    <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    }}>
        <img alt={'logo-item-1'} src={shopSvg}/>
        <img alt={'logo-item-2'} src={rechargeCitySvg}/>
    </div>
)
