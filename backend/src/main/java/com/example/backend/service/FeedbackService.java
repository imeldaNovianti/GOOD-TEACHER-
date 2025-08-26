package com.example.backend.service;

import com.example.backend.model.Feedback;
import com.example.backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    public Feedback createFeedback(Feedback feedback) {
        return repo.save(feedback);
    }

    public Feedback updateFeedback(Long id, Feedback newData) {
        Optional<Feedback> opt = repo.findById(id);
        if (opt.isPresent()) {
            Feedback f = opt.get();
            f.setType(newData.getType());
            f.setTitle(newData.getTitle());
            f.setContent(newData.getContent());
            f.setThemeColor(newData.getThemeColor());
            f.setAnonim(newData.getAnonim());
            return repo.save(f);
        }
        return null;
    }

    public boolean deleteFeedback(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Feedback> getAllFeedback() {
        return repo.findAll();
    }

    public List<Feedback> getFeedbackByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    public Optional<Feedback> getById(Long id) {
        return repo.findById(id);
    }
}
