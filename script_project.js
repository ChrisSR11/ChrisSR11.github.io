document.addEventListener("DOMContentLoaded", function() {
    const heroTitle = document.querySelector("header h1");
    if (heroTitle) {
        const text = "Welcome to My Portfolio";
        let i = 0;
        heroTitle.textContent = ""; 
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50); 
            } else {
                const cursor = document.createElement("span");
                cursor.className = "blinking-cursor";
                cursor.textContent = "|";
                heroTitle.appendChild(cursor);
            }
        }
        
        setTimeout(typeWriter, 300);
    }

    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
        const skillsData = [
            { name: "HTML", level: 80 },
            { name: "CSS", level: 80 },
            { name: "JavaScript", level: 80 },
            { name: "Python", level: 85 },
            { name: "C++", level: 100 },
            { name: "Java", level: 100 }
        ];

        const chartContainer = document.createElement("div");
        chartContainer.className = "skills-chart";
        
        skillsData.forEach(skill => {
            const skillBar = document.createElement("div");
            skillBar.className = "skill-bar";
            
            const skillName = document.createElement("span");
            skillName.className = "skill-name";
            skillName.textContent = skill.name;
            
            const barContainer = document.createElement("div");
            barContainer.className = "bar-container";
            
            const skillLevel = document.createElement("div");
            skillLevel.className = "skill-level";
            skillLevel.style.width = "0";
            skillLevel.dataset.level = skill.level;
            
            const percentText = document.createElement("span");
            percentText.className = "skill-percent";
            percentText.textContent = "0%";
            
            barContainer.append(skillLevel, percentText);
            skillBar.append(skillName, barContainer);
            chartContainer.append(skillBar);
        });
        
        skillsSection.append(chartContainer);
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll(".skill-level").forEach(bar => {
                        const targetWidth = bar.dataset.level + "%";
                        bar.style.width = targetWidth;
                        animatePercentage(bar.nextElementSibling, parseInt(bar.dataset.level));
                    });
                    skillObserver.disconnect();
                }
            });
        }, { threshold: 0.1 });
        
        skillObserver.observe(skillsSection);

        function animatePercentage(element, target) {
            let current = 0;
            const duration = 1500; 
            const increment = target / (duration / 16); 
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                element.textContent = Math.round(current) + "%";
            }, 16);
        }
    }

    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
    
    if (savedTheme === "dark") body.classList.add("dark");
    themeToggle.textContent = savedTheme === "dark" ? "Light" : "Dark";

    themeToggle.addEventListener("click", function() {
        body.classList.toggle("dark");
        const isDark = body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.textContent = isDark ? "Light" : "Dark";
        body.classList.add("theme-transition");
        setTimeout(() => body.classList.remove("theme-transition"), 500);
    });

    let lastScrollPosition = 0;

    const animateOnScroll = (elements) => {
        const observer = new IntersectionObserver((entries) => {
            const currentScrollPosition = window.pageYOffset;
            const scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
            lastScrollPosition = currentScrollPosition;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in", scrollDirection);
                } else {
                    entry.target.classList.remove("animate-in", "down", "up");
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px"
        });

        elements.forEach(el => {
            el.classList.remove("animate-in", "down", "up");
            observer.observe(el);
        });
    };

    animateOnScroll(document.querySelectorAll("section"));
    animateOnScroll(document.querySelectorAll(".project-card"));
    animateOnScroll(document.querySelectorAll(".about-block"));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });
                history.pushState(null, null, this.getAttribute("href"));
            }
        });
    });

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${angleX}deg)
                rotateY(${angleY}deg)
                translateY(-10px)
            `;
            card.style.boxShadow = `
                ${-angleY * 2}px ${angleX * 2}px 20px rgba(0,0,0,0.2)
            `;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.boxShadow = "";
        });
    });

    document.getElementById("current-year").textContent = new Date().getFullYear();
});