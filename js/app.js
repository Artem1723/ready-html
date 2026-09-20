gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

if (ScrollTrigger.isTouch !== 1) {

	window.smoother = ScrollSmoother.create({
		wrapper: '.wrapper',
		content: '.content',
		smooth: 1.5,
		effects: true
	})

	// Приветственная анимация шапки
	gsap.fromTo('.main-title', 
		{ y: 60, opacity: 0 }, 
		{ y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
	)
	gsap.fromTo('.main-subtitle', 
		{ y: 30, opacity: 0 }, 
		{ y: 0, opacity: 0.9, duration: 1, ease: 'power3.out', delay: 0.5 }
	)
	gsap.fromTo('.hero', 
		{ opacity: 0 }, 
		{ opacity: 1, duration: 1.8, ease: 'power2.out' }
	)

	// Затухание шапки при скролле (плавно догоняет скролл)
	gsap.fromTo('.hero-section', { opacity: 1 }, {
		opacity: 0,
		scrollTrigger: {
			trigger: '.hero-section',
			start: 'center',
			end: '820',
			scrub: 1.2
		}
	})

	// Появление галереи слева
	let itemsL = gsap.utils.toArray('.gallery__left .gallery__item')
	itemsL.forEach(item => {
		gsap.fromTo(item, { opacity: 0, x: -50 }, {
			opacity: 1, x: 0,
			scrollTrigger: {
				trigger: item,
				start: '-850',
				end: '-100',
				scrub: 1.2
			}
		})
	})

	// Появление галереи справа
	let itemsR = gsap.utils.toArray('.gallery__right .gallery__item')
	itemsR.forEach(item => {
		gsap.fromTo(item, { opacity: 0, x: 50 }, {
			opacity: 1, x: 0,
			scrollTrigger: {
				trigger: item,
				start: '-750',
				end: 'top',
				scrub: 1.2
			}
		})
	})

	// Единый язык движения: все секции появляются одинаково
	gsap.utils.toArray('.divider, .accordion-layout, .cta-title, .cta-subtitle, .cta-buttons').forEach(el => {
		gsap.fromTo(el, { opacity: 0, y: 40 }, {
			opacity: 1, y: 0,
			duration: 1,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: el,
				start: 'top 88%'
			}
		})
	})

}

// ===== ЛАЙТБОКС: открытие по клику, закрытие по клику на фон =====
const initLightbox = () => {
	const lightbox = document.querySelector('.lightbox')
	if (!lightbox) return

	const img = lightbox.querySelector('.lightbox__img')
	const backdrop = lightbox.querySelector('.lightbox__backdrop')

	const open = (src) => {
		img.src = src
		lightbox.classList.add('open')
		if (window.smoother) window.smoother.paused(true)
	}
	const close = () => {
		lightbox.classList.remove('open')
		if (window.smoother) window.smoother.paused(false)
	}

	document.querySelectorAll('.accordion-section .option').forEach(option => {
		option.addEventListener('click', () => {
			const bg = getComputedStyle(option).backgroundImage
			const match = bg.match(/url\(["']?(.+?)["']?\)/)
			if (match && match[1]) open(match[1])
		})
	})

	backdrop.addEventListener('click', close)

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') close()
	})
}

document.addEventListener('DOMContentLoaded', initLightbox)

// ===== ФАВИКОНКА: перекрашиваем логотип в золото =====
const makeFavicon = () => {
	const img = new Image()
	img.src = 'img/logo.png'
	img.onload = () => {
		try {
			const canvas = document.createElement('canvas')
			canvas.width = img.width
			canvas.height = img.height
			const ctx = canvas.getContext('2d')
			ctx.drawImage(img, 0, 0)
			const d = ctx.getImageData(0, 0, canvas.width, canvas.height)
			for (let i = 0; i < d.data.length; i += 4) {
				d.data[i]     = 212
				d.data[i + 1] = 165
				d.data[i + 2] = 116
			}
			ctx.putImageData(d, 0, 0)
			let link = document.querySelector('link[rel="icon"]')
			if (!link) {
				link = document.createElement('link')
				link.rel = 'icon'
				document.head.appendChild(link)
			}
			link.href = canvas.toDataURL('image/png')
		} catch (e) {}
	}
}

document.addEventListener('DOMContentLoaded', makeFavicon)

// ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
const themeToggle = document.querySelector('.theme-toggle')
if (themeToggle) {
	themeToggle.addEventListener('click', () => {
		const root = document.documentElement
		const isLight = root.getAttribute('data-theme') === 'light'
		if (isLight) {
			root.removeAttribute('data-theme')
		} else {
			root.setAttribute('data-theme', 'light')
		}
		try { localStorage.setItem('theme', isLight ? 'dark' : 'light') } catch (e) {}
	})
}