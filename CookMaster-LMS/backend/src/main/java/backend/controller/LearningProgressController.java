package backend.controller;

import backend.exception.LearningProgressNotFoundException;
import backend.model.LearningProgressModel;
import backend.repository.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningProgressController {

    @Autowired
    private LearningProgressRepository learningProgressRepository;

    @Value("${media.upload.dir}")
    private String uploadDir;

    // Create with image
    @PostMapping("/learningProgress")
    public LearningProgressModel newLearningProgressModel(
            @RequestPart("data") LearningProgressModel newLearningProgressModel,
            @RequestPart(value = "media", required = false) MultipartFile mediaFile
    ) throws IOException {

        if (mediaFile != null && !mediaFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + mediaFile.getOriginalFilename();
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) uploadPath.mkdirs();

            File destFile = new File(uploadPath, fileName);
            mediaFile.transferTo(destFile);
            newLearningProgressModel.setMedia(fileName);
        }

        return learningProgressRepository.save(newLearningProgressModel);
    }

    @GetMapping("/learningProgress")
    List<LearningProgressModel> getAll() {
        return learningProgressRepository.findAll();
    }

    @GetMapping("/learningProgress/{id}")
    LearningProgressModel getById(@PathVariable String id) {
        return learningProgressRepository.findById(id)
                .orElseThrow(() -> new LearningProgressNotFoundException(id));
    }

    @PutMapping("/learningProgress/{id}")
    LearningProgressModel update(
            @PathVariable String id,
            @RequestPart("data") LearningProgressModel newLearningProgressModel,
            @RequestPart(value = "media", required = false) MultipartFile mediaFile
    ) throws IOException {

        return learningProgressRepository.findById(id)
                .map(existing -> {
                    existing.setSkillTitle(newLearningProgressModel.getSkillTitle());
                    existing.setDescription(newLearningProgressModel.getDescription());
                    existing.setPostOwnerID(newLearningProgressModel.getPostOwnerID());
                    existing.setPostOwnerName(newLearningProgressModel.getPostOwnerName());
                    existing.setField(newLearningProgressModel.getField());
                    existing.setStartDate(newLearningProgressModel.getStartDate());
                    existing.setEndDate(newLearningProgressModel.getEndDate());
                    existing.setLevel(newLearningProgressModel.getLevel());

                    if (mediaFile != null && !mediaFile.isEmpty()) {
                        try {
                            String fileName = UUID.randomUUID() + "_" + mediaFile.getOriginalFilename();
                            File uploadPath = new File(uploadDir);
                            if (!uploadPath.exists()) uploadPath.mkdirs();

                            File destFile = new File(uploadPath, fileName);
                            mediaFile.transferTo(destFile);
                            existing.setMedia(fileName);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to upload media", e);
                        }
                    }

                    return learningProgressRepository.save(existing);
                }).orElseThrow(() -> new LearningProgressNotFoundException(id));
    }

    @DeleteMapping("/learningProgress/{id}")
    public void delete(@PathVariable String id) {
        learningProgressRepository.deleteById(id);
    }
}
