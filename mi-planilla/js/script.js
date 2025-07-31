
        let tasks = [
            { id: 1, date: '31/07', time: '9:00/9:30', task: 'Despertar / Estiramientos', completed: false },
            { id: 2, date: '31/07', time: '9:30/12:30', task: 'Estudio Python', completed: false },
            { id: 3, date: '31/07', time: '12:30/14:00', task: 'Almuerzo / Siestita', completed: false },
            { id: 4, date: '31/07', time: '14:00/16:00', task: 'Estudio practico / proyectos practicos', completed: false },
            { id: 5, date: '31/07', time: '16:00/16:30', task: 'Crear contenido para las casas', completed: false },
            { id: 6, date: '31/07', time: '16:30/17:30', task: 'Ejercicios / Estiramientos', completed: false },
            { id: 7, date: '31/07', time: '17:30/18:30', task: 'Tareas Administrativas (Empresa papa, Empresa Alejandro, mi Linkedin, etc)', completed: false },
            { id: 8, date: '31/07', time: '18:30/21:00', task: 'Estudio Python y complementares', completed: false },
            { id: 9, date: '01/08', time: '9:00/9:30', task: 'Despertar / Estiramientos', completed: false },
            { id: 10, date: '01/08', time: '9:30/12:30', task: 'Estudio Python', completed: false },
            { id: 11, date: '01/08', time: '12:30/14:00', task: 'Almuerzo / Siestita', completed: false },
            { id: 12, date: '01/08', time: '14:00/16:00', task: 'Estudio practico / proyectos practicos', completed: false },
            { id: 13, date: '01/08', time: '16:00/16:30', task: 'Crear contenido para las casas', completed: false }
        ];

        // Función mejorada para móvil
        function saveToLocalStorage() {
            try {
                localStorage.setItem('studyTasks', JSON.stringify(tasks));
            } catch (e) {
                console.log('No se pudo guardar en localStorage');
            }
        }

        function loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('studyTasks');
                if (saved) {
                    tasks = JSON.parse(saved);
                }
            } catch (e) {
                console.log('No se pudo cargar desde localStorage');
            }
        }

        function toggleAddForm() {
            const form = document.getElementById('add-form');
            form.style.display = form.style.display === 'block' ? 'none' : 'block';
            
            // Focus en el primer input cuando se abre el formulario
            if (form.style.display === 'block') {
                setTimeout(() => {
                    document.getElementById('new-date').focus();
                }, 100);
            }
        }

        function addTask() {
            const date = document.getElementById('new-date').value.trim();
            const time = document.getElementById('new-time').value.trim();
            const task = document.getElementById('new-task').value.trim();

            if (date && time && task) {
                const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
                tasks.push({ id: newId, date, time, task, completed: false });
                
                document.getElementById('new-date').value = '';
                document.getElementById('new-time').value = '';
                document.getElementById('new-task').value = '';
                
                toggleAddForm();
                saveToLocalStorage();
                renderTasks();
            } else {
                alert('Por favor completa todos los campos');
            }
        }

        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                saveToLocalStorage();
                renderTasks();
            }
        }

        function deleteTask(id) {
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                tasks = tasks.filter(t => t.id !== id);
                saveToLocalStorage();
                renderTasks();
            }
        }

        function updateProgress() {
            const completed = tasks.filter(t => t.completed).length;
            const total = tasks.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            document.getElementById('progress-text').textContent = `Progreso: ${completed}/${total} tareas`;
            document.getElementById('progress-percent').textContent = `${percentage}%`;
            document.getElementById('progress-fill').style.width = `${percentage}%`;

            const footerText = document.getElementById('footer-text');
            if (completed > 0) {
                const remaining = total - completed;
                footerText.textContent = `¡Genial! Has completado ${completed} tarea${completed > 1 ? 's' : ''}. ${remaining > 0 ? `Te quedan ${remaining} por hacer.` : '¡Has terminado todo!'}`;
            } else {
                footerText.textContent = '¡Comienza a marcar tus tareas!';
            }
        }

        function groupTasksByDate(tasks) {
            return tasks.reduce((groups, task) => {
                if (!groups[task.date]) {
                    groups[task.date] = [];
                }
                groups[task.date].push(task);
                return groups;
            }, {});
        }

        function renderTasks() {
            const container = document.getElementById('tasks-container');
            const grouped = groupTasksByDate(tasks);
            
            container.innerHTML = '';

            Object.entries(grouped).forEach(([date, dateTasks]) => {
                const dateGroup = document.createElement('div');
                dateGroup.className = 'date-group';

                const dateHeader = document.createElement('div');
                dateHeader.className = 'date-header';
                dateHeader.innerHTML = `<i data-feather="calendar"></i> ${date}`;
                dateGroup.appendChild(dateHeader);

                dateTasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

                    taskItem.innerHTML = `
                        <div class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
                            ${task.completed ? '<i data-feather="check"></i>' : ''}
                        </div>
                        <div class="task-content">
                            <div class="task-time">
                                <i data-feather="clock"></i>
                                ${task.time}
                            </div>
                            <div class="task-description ${task.completed ? 'completed' : ''}">
                                ${task.task}
                            </div>
                        </div>
                        <button class="delete-btn" onclick="deleteTask(${task.id})" title="Eliminar tarea">
                            <i data-feather="trash-2"></i>
                        </button>
                    `;

                    dateGroup.appendChild(taskItem);
                });

                container.appendChild(dateGroup);
            });

            feather.replace();
            updateProgress();
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadFromLocalStorage();
            renderTasks();
            feather.replace();
        });

        // Handle Enter key in form inputs
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.classList.contains('form-input')) {
                e.preventDefault();
                addTask();
            }
        });

        // Prevent zoom on double-tap for better mobile UX
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    