async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
    let selectedCard = null; // Track the currently selected card
  
    async function fetchData() {
      try {
        const learnersResponse = await fetch('http://localhost:3003/api/learners');
        const learnersData = await learnersResponse.json();
    
        const mentorsResponse = await fetch('http://localhost:3003/api/mentors');
        const mentorsData = await mentorsResponse.json();
    
        const combinedData = learnersData.map(learner => {
          const mentorObjects = learner.mentors.map(mentorId => {
            // Find the mentor object with the corresponding ID
            const mentor = mentorsData.find(mentor => mentor.id === mentorId);
            return mentor ? `${mentor.firstName} ${mentor.lastName}` : ''; // Format mentor's name
          });
    
          return {
            id: learner.id,
            email: learner.email,
            fullName: learner.fullName,
            mentors: mentorObjects // Replace mentor IDs with mentor objects
          };
        });
    
        return combinedData;
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    }
  
    function createLearnerCard(learner) {
      const card = document.createElement('div');
      card.classList.add('card');
      
      const name = document.createElement('h3');
      name.textContent = `${learner.fullName}, ID ${learner.id}`;
      card.appendChild(name);
      
      const email = document.createElement('div');
      email.textContent = learner.email;
      card.appendChild(email);
  
      const mentorsHeading = document.createElement('h4');
      mentorsHeading.textContent = 'Mentors';
      card.appendChild(mentorsHeading);
      
      const mentorsList = document.createElement('ul');
  
      if (Array.isArray(learner.mentors)) {
        learner.mentors.forEach(mentor => {
          const mentorItem = document.createElement('li');
          mentorItem.textContent = mentor; 
          mentorsList.appendChild(mentorItem);
        });
      }
      card.appendChild(mentorsList);
    
      card.addEventListener('click', () => {
        if (selectedCard !== card) { // If the clicked card is not the currently selected card
          // Deselect the previously selected card (if any)
          if (selectedCard) {
            selectedCard.classList.remove('selected');
          }
          // Update the selected card to the newly clicked card
          selectedCard = card;
        }
        // Toggle the 'selected' class on the clicked card
        card.classList.toggle('selected');
        updateInfo();
      });
    
      return card;
    }
    
    document.addEventListener('click', event => {
      const selectedCard = document.querySelector('.card.selected');
      if (selectedCard) {
        const mentorsHeading = selectedCard.querySelector('h4');
        const mentorsList = selectedCard.querySelector('ul');
    
        if (event.target === mentorsHeading) { // If "Mentors" heading is clicked
          mentorsList.style.display = mentorsList.style.display === 'none' ? 'block' : 'none';
        }
      }
    });
    
  
    async function renderLearnerCards() {
      const container = document.querySelector('.cards');
      const learners = await fetchData();
  
      container.innerHTML = '';
  
      learners.forEach(learner => {
        const card = createLearnerCard(learner);
        container.appendChild(card);
      });
      hideMentors()
    }
  
  
    function updateInfo() {
  const info = document.querySelector('.info');
  const selectedCard = document.querySelector('.card.selected');

  if (selectedCard) {
    const name = selectedCard.querySelector('h3').textContent.split(',')[0]; // Extract only the name
    info.textContent = `The selected learner is ${name}`;
  } else {
    info.textContent = 'No learner is selected';
  }
}
    
  
    renderLearnerCards();
    updateInfo();
  
    const footer = document.querySelector('footer');
    const currentYear = new Date().getFullYear();
    footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY 2023`;
  
    function hideMentors() {
      const mentorsLists = document.querySelectorAll('.card ul');
      mentorsLists.forEach(list => {
        list.style.display = 'none';
        const heading = list.previousElementSibling; 
        heading.classList.add('closed'); 
      });
    }
  }
  
  // ❗ DO NOT CHANGE THE CODE  BELOW
  if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
  else sprintChallenge5()
  