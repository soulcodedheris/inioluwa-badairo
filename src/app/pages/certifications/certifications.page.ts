import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string[];
  description: string;
  badgeUrl?: string;
  pdfUrl: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-certifications-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './certifications.page.html',
  styleUrls: ['./certifications.page.css']
})
export class CertificationsPage {
  searchTerm: string = '';
  selectedSkill: string = '';
  
  allCertifications: Certification[] = [
    {
      id: 'google-ai-essentials',
      name: 'Google AI Essentials',
      organization: 'Google',
      issueDate: 'January 2025',
      credentialId: 'CERT-001',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/example1',
      skills: ['AI Fundamentals', 'Machine Learning', 'Google AI Tools'],
      description: 'Comprehensive training in AI fundamentals, covering machine learning basics, Google AI tools, and practical applications for business.',
      badgeUrl: 'https://www.credly.com/badges/41e488c8-eb85-4498-9d07-04b7b0e1c0cb/linked_in_profile',
      pdfUrl: '/certificates/google-ai-essentials.pdf',
      thumbnailUrl: '/certificates/google-ai-essentials-thumb.png'
    },
    {
      id: 'google-discover-art-of-prompting',
      name: 'Discover the Art of Prompting',
      organization: 'Google',
      issueDate: 'January 2025',
      credentialId: 'CERT-002',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/example2',
      skills: ['Prompt Engineering', 'AI Communication', 'Creative AI'],
      description: 'Mastered the art of crafting effective prompts for AI systems, enabling better communication and more accurate AI responses.',
      badgeUrl: 'https://www.credly.com/badges/41e488c8-eb85-4498-9d07-04b7b0e1c0cb/linked_in_profile',
      pdfUrl: '/certificates/google-discover-art-of-prompting.pdf',
      thumbnailUrl: '/certificates/google-discover-art-of-prompting-thumb.png'
    },
    {
      id: 'google-introduction-to-ai',
      name: 'Introduction to AI',
      organization: 'Google',
      issueDate: 'January 2025',
      credentialId: 'CERT-003',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/example3',
      skills: ['AI Basics', 'Neural Networks', 'AI Applications'],
      description: 'Foundational understanding of artificial intelligence, including neural networks, machine learning algorithms, and real-world AI applications.',
      badgeUrl: 'https://www.credly.com/badges/41e488c8-eb85-4498-9d07-04b7b0e1c0cb/linked_in_profile',
      pdfUrl: '/certificates/google-introduction-to-ai.pdf',
      thumbnailUrl: '/certificates/google-introduction-to-ai-thumb.png'
    },
    {
      id: 'google-maximize-productivity',
      name: 'Maximize Productivity with AI',
      organization: 'Google',
      issueDate: 'January 2025',
      credentialId: 'CERT-004',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/example4',
      skills: ['Productivity Tools', 'AI Automation', 'Workflow Optimization'],
      description: 'Learned to leverage AI tools for maximum productivity, including automation, workflow optimization, and intelligent task management.',
      badgeUrl: 'https://www.credly.com/badges/41e488c8-eb85-4498-9d07-04b7b0e1c0cb/linked_in_profile',
      pdfUrl: '/certificates/google-maximize-productivity.pdf',
      thumbnailUrl: '/certificates/google-maximize-productivity-thumb.png'
    },
    {
      id: 'google-stay-ahead-ai-curve',
      name: 'Stay Ahead of the AI Curve',
      organization: 'Google',
      issueDate: 'January 2025',
      credentialId: 'CERT-005',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/example5',
      skills: ['AI Trends', 'Future Technology', 'Strategic Planning'],
      description: 'Developed strategic insights into AI trends and future technologies, enabling proactive adaptation to the evolving AI landscape.',
      badgeUrl: 'https://www.credly.com/badges/41e488c8-eb85-4498-9d07-04b7b0e1c0cb/linked_in_profile',
      pdfUrl: '/certificates/google-stay-ahead-ai-curve.pdf',
      thumbnailUrl: '/certificates/google-stay-ahead-ai-curve-thumb.png'
    },
    {
      id: 'google-use-ai-responsibly',
      name: 'Use AI Responsibly',
      organization: 'Google',
      issueDate: 'January 2025',
      credentialId: 'CERT-006',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/certificate/example6',
      skills: ['AI Ethics', 'Responsible AI', 'Bias Prevention'],
      description: 'Comprehensive training in responsible AI development, including ethics, bias prevention, and ensuring AI systems benefit society.',
      badgeUrl: 'https://www.credly.com/badges/41e488c8-eb85-4498-9d07-04b7b0e1c0cb/linked_in_profile',
      pdfUrl: '/certificates/google-use-ai-responsibly.pdf',
      thumbnailUrl: '/certificates/google-use-ai-responsibly-thumb.png'
    }
  ];

  get certifications(): Certification[] {
    let filtered = this.allCertifications;
    
    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cert => 
        cert.name.toLowerCase().includes(term) ||
        cert.description.toLowerCase().includes(term) ||
        cert.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Filter by selected skill
    if (this.selectedSkill) {
      filtered = filtered.filter(cert => 
        cert.skills.includes(this.selectedSkill)
      );
    }
    
    return filtered;
  }

  get allSkills(): string[] {
    const skills = new Set<string>();
    this.allCertifications.forEach(cert => {
      cert.skills.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }

  get filteredCount(): number {
    return this.certifications.length;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSkill = '';
  }

  trackByCertId(index: number, cert: Certification): string {
    return cert.id;
  }
}
