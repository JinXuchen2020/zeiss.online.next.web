import React, { useRef, useLayoutEffect } from 'react'

export default function WWOpenDataCom({ type, openid }) {
	const ref = useRef(null)
	useLayoutEffect(() => {
		window.WWOpenData.bind(ref.current)
	})
	return <ww-open-data ref={ref} type={type} openid={openid} />
}