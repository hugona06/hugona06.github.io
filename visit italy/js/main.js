
document.addEventListener("DOMContentLoaded", () => {
    
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (galleryGrid && typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
        
        gsap.registerPlugin(Flip);

        const items = document.querySelectorAll('.mosaic-item');
        
        const venice = document.getElementById('item-venice');
        const rome = document.getElementById('item-rome');
        const florence = document.getElementById('item-florence');
        
        const topRowItems = [venice, rome, florence];

        items.forEach(el => {
            const img = el.querySelector('img');
            
            el.addEventListener('mouseenter', () => {
                if(!el.classList.contains('is-expanded')) {
                    gsap.to(img, { scale: 1.15, duration: 0.5 });
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if(!el.classList.contains('is-expanded')) {
                    gsap.to(img, { scale: 1, duration: 0.5 });
                }
            });
        });

        window.expandGalleryItem = function(itemId, rowType, colIndex) {
            const clickedItem = document.getElementById(itemId);
            if(clickedItem.classList.contains('is-expanded')) return;

            if (rowType === 'bottom') {
                gsap.to(rome, { autoAlpha: 0, duration: 0.2 });
            }

            const state = Flip.getState(items);
            
            items.forEach(item => {
                item.classList.remove(
                    'is-expanded', 'moved-top-left', 'moved-top-right', 
                    'moved-bot-1', 'moved-bot-2', 'moved-bot-3', 'moved-bot-4', 
                    'content-visible'
                );
                
                const contentElements = item.querySelectorAll('.item-overlay, .btn-toggle-text, .btn-close-gallery');
                gsap.set(contentElements, { opacity: 0 });

                if(item.id === 'item-venice') item.classList.add('mosaic-item--venice');
                if(item.id === 'item-rome') item.classList.add('mosaic-item--rome');
                if(item.id === 'item-florence') item.classList.add('mosaic-item--florence');
            });

            galleryGrid.classList.add('mode-active');
            clickedItem.classList.add('is-expanded');

            if(rowType === 'top') {
                const others = topRowItems.filter(i => i.id !== itemId);
                others[0].classList.add('moved-top-left'); 
                others[1].classList.add('moved-top-right');
            }
            if(rowType === 'bottom') {
                venice.classList.add('moved-top-left'); 
                florence.classList.add('moved-top-right');
                rome.classList.add(`moved-bot-${colIndex}`);
            }

            Flip.from(state, { 
                duration: 0.8, 
                ease: "power2.inOut", 
                absolute: true, 
                zIndex: 50,
                onComplete: () => {
                    const overlay = clickedItem.querySelector('.item-overlay');
                    const eye = clickedItem.querySelector('.btn-toggle-text');
                    const close = clickedItem.querySelector('.btn-close-gallery');
                    
                    clickedItem.classList.add('content-visible');
                    
                    gsap.to([overlay, eye, close], { opacity: 1, duration: 0.5, stagger: 0.1 });
                    
                    if (rowType === 'bottom') {
                        gsap.to(rome, { autoAlpha: 1, duration: 0.5 });
                    }
                }
            });
        };

        window.resetGallery = function(e) {
            if(e) e.stopPropagation();

            const state = Flip.getState(items);
            
            galleryGrid.classList.remove('mode-active');
            
            items.forEach(item => {
                item.className = 'mosaic-item'; 
                if(item.id === 'item-venice') item.classList.add('mosaic-item--venice');
                if(item.id === 'item-rome') item.classList.add('mosaic-item--rome');
                if(item.id === 'item-florence') item.classList.add('mosaic-item--florence');
                if(item.id === 'item-milan') item.classList.add('mosaic-item--bottom-1');
                if(item.id === 'item-naples') item.classList.add('mosaic-item--bottom-2');
                if(item.id === 'item-sicily') item.classList.add('mosaic-item--bottom-3');
                if(item.id === 'item-dolomites') item.classList.add('mosaic-item--bottom-4');
                
                item.classList.remove('text-hidden');
                item.classList.remove('content-visible');

                const contentElements = item.querySelectorAll('.item-overlay, .btn-toggle-text, .btn-close-gallery');
                gsap.set(contentElements, { opacity: 0 });

                if(item.id === 'item-rome') gsap.set(item, { autoAlpha: 1 });
            });

            Flip.from(state, { 
                duration: 0.6, 
                ease: "power2.inOut", 
                absolute: true, 
                onComplete: () => {
                     items.forEach(i => gsap.set(i.querySelector('img'), {scale: 1}));
                }
            });
        };

        window.toggleText = function(e, btn) { 
            e.stopPropagation(); 
            const item = btn.parentElement;
            
            item.classList.toggle('text-hidden'); 
            
            const icon = btn.querySelector('i');
            const overlay = item.querySelector('.item-overlay');
            const xBtn = item.querySelector('.btn-close-gallery');

            if(item.classList.contains('text-hidden')) {
                icon.className = 'fas fa-eye-slash';
                gsap.to(overlay, { opacity: 0, duration: 0.3 });
                gsap.to(xBtn, { opacity: 0.5, duration: 0.3 });
            } else {
                icon.className = 'fas fa-eye';
                gsap.to(overlay, { opacity: 1, duration: 0.1 });
                gsap.to(xBtn, { opacity: 1, duration: 0.1 });
            }
        };

        document.getElementById('item-venice').onclick = () => window.expandGalleryItem('item-venice', 'top');
        document.getElementById('item-rome').onclick = () => window.expandGalleryItem('item-rome', 'top');
        document.getElementById('item-florence').onclick = () => window.expandGalleryItem('item-florence', 'top');
        document.getElementById('item-milan').onclick = () => window.expandGalleryItem('item-milan', 'bottom', 1);
        document.getElementById('item-naples').onclick = () => window.expandGalleryItem('item-naples', 'bottom', 2);
        document.getElementById('item-sicily').onclick = () => window.expandGalleryItem('item-sicily', 'bottom', 3);
        document.getElementById('item-dolomites').onclick = () => window.expandGalleryItem('item-dolomites', 'bottom', 4);

        document.querySelectorAll('.btn-close-gallery').forEach(btn => {
            btn.onclick = (e) => window.resetGallery(e);
        });

        document.querySelectorAll('.btn-toggle-text').forEach(btn => {
            btn.onclick = (e) => window.toggleText(e, btn);
        });
    }
});