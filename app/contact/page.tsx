export default function Contact() {
  return (
    <main>
      <h1>Contact</h1>
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Feel free to reach out if you have any questions or opportunities.</p>
          <div className="social-links">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="mailto:your.email@example.com">Email</a>
          </div>
        </div>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required></textarea>
          </div>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
} 