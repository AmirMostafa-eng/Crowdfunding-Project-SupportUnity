        function confirmAction(message) {
            return confirm(message);
        }

        // var gk_isXlsx = false;
        // var gk_xlsxFileLookup = {};
        // var gk_fileData = {};
        // function filledCell(cell) {
        //   return cell !== '' && cell != null;
        // }
        // function loadFileData(filename) {
        // if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        //     try {
        //         var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
        //         var firstSheetName = workbook.SheetNames[0];
        //         var worksheet = workbook.Sheets[firstSheetName];

        //         // Convert sheet to JSON to filter blank rows
        //         var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
        //         // Filter out blank rows (rows where all cells are empty, null, or undefined)
        //         var filteredData = jsonData.filter(row => row.some(filledCell));

        //         // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
        //         var headerRowIndex = filteredData.findIndex((row, index) =>
        //           row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
        //         );
        //         // Fallback
        //         if (headerRowIndex === -1 || headerRowIndex > 25) {
        //           headerRowIndex = 0;
        //         }

        //         // Convert filtered JSON back to CSV
        //         var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
        //         csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
        //         return csv;
        //     } catch (e) {
        //         console.error(e);
        //         return "";
        //     }
        // }
        // return gk_fileData[filename] || "";
        // }
// Sidebar toggle for mobile
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mainContent = document.getElementById('mainContent');
        // const url = 'http://localhost:3000';

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('full-width');
        });

        // Section navigation
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        const sections = document.querySelectorAll('.dashboard-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show/hide sections
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });

                // Close sidebar on mobile after clicking
                if (window.innerWidth <= 991.98) {
                    sidebar.classList.remove('collapsed');
                    mainContent.classList.add('full-width');
                }
            });
        });

        // Fetch data functions
        async function fetchData(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Error fetching ${url}:`, error);
                return [];
            }
        }

        async function populateUsers() {
            const users = await fetchData('http://localhost:3000/users');
            const usersTable = document.getElementById('usersTable');
            const allUsersTable = document.getElementById('allUsersTable');
            usersTable.innerHTML = '';
            allUsersTable.innerHTML = '';

            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.status}</td>
                        ${user.role === 'Pending Campaigner' ? `
                            <td>
                                <button class="btn btn-action btn-approve me-2" onclick="confirmAction('Approve Campaigner role for ${user.username}?')">Approve</button>
                                <button class="btn btn-action btn-reject me-2" onclick="confirmAction('Reject Campaigner role for ${user.username}?')">Reject</button>
                                <button class="btn btn-action btn-ban" onclick="confirmAction('Ban ${user.username}?')">Ban</button>
                            </td>
                        ` : `
                            <td>
                                <button class="btn btn-action btn-ban" onclick="confirmAction('Ban ${user.username}?')">Ban</button>
                            </td>
                        `}
                    </tr>
                `;
                usersTable.innerHTML += row;
                allUsersTable.innerHTML += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.status}</td>
                    </tr>
                `;
            });
        }

        async function populateCampaigns() {
            const campaigns = await fetchData('http://localhost:3000/campaigns');
            const campaignsTable = document.getElementById('campaignsTable');
            const allCampaignsTable = document.getElementById('allCampaignsTable');
            campaignsTable.innerHTML = '';
            allCampaignsTable.innerHTML = '';

            campaigns.forEach(campaign => {
                const row = `
                    <tr>
                        <td>${campaign.title}</td>
                        <td>${campaign.creator}</td>
                        <td>$${campaign.fundingGoal}</td>
                        <td>${campaign.status}</td>
                        ${campaign.status === 'Pending' ? `
                            <td>
                                <button class="btn btn-action btn-approve me-2" onclick="confirmAction('Approve ${campaign.title}?')">Approve</button>
                                <button class="btn btn-action btn-reject me-2" onclick="confirmAction('Reject ${campaign.title}?')">Reject</button>
                                <button class="btn btn-action btn-delete" onclick="confirmAction('Delete ${campaign.title}?')">Delete</button>
                            </td>
                        ` : `
                            <td>
                                <button class="btn btn-action btn-delete" onclick="confirmAction('Delete ${campaign.title}?')">Delete</button>
                            </td>
                        `}
                    </tr>
                `;
                campaignsTable.innerHTML += row;
                allCampaignsTable.innerHTML += `
                    <tr>
                        <td>${campaign.title}</td>
                        <td>${campaign.creator}</td>
                        <td>$${campaign.fundingGoal}</td>
                        <td>$${campaign.raised}</td>
                        <td>${campaign.status}</td>
                    </tr>
                `;
            });
        }

        async function populatePledges() {
            const pledges = await fetchData('http://localhost:3000/pledges');
            const pledgesTable = document.getElementById('pledgesTable');
            pledgesTable.innerHTML = '';

            pledges.forEach(pledge => {
                pledgesTable.innerHTML += `
                    <tr>
                        <td>${pledge.backer}</td>
                        <td>${pledge.campaign}</td>
                        <td>$${pledge.amount}</td>
                        <td>${pledge.date}</td>
                    </tr>
                `;
            });
        }

        // Confirmation function (placeholder)
        function confirmAction(message) {
            if (confirm(message)) {
                alert('Action confirmed!');
                // Implement actual action logic here
            }
        }

        // Initialize data
        async function init() {
            await Promise.all([
                populateUsers(),
                populateCampaigns(),
                populatePledges()
            ]);
        }

        init();